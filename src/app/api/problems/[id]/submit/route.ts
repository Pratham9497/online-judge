import UserModel, { Submission } from "@/models/User";
import ProblemModel from "@/models/Problem";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { generateFiles, generateInput } from "@/utils/generateFiles";
import { compileCpp, compileJava, runCpp, runJS, runJava, runPy } from "@/utils/executeCode";
import { Types } from "mongoose";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import fs from 'fs/promises'

type Params = {
    params: {
        id: string
    }
}

export async function POST(request: NextRequest, { params: { id } }: Params) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 402 })
    }

    await dbConnect()

    const { ext, code } = await request.json()

    let removeDir

    try {
        if (!Number.isInteger(Number(id))) {
            return NextResponse.json({
                success: false,
                message: "Invalid Params"
            }, { status: 404 })
        }
        const pid = parseInt(id)
        console.log(session.user.username)

        const user = await UserModel.findOne({ username: session.user.username })

        // this case will not exist
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not registered"
            }, { status: 404 })
        }

        const problem = await ProblemModel.findOne({ id: pid })
        if (!problem) {
            return NextResponse.json({
                success: false,
                message: "Problem Not Found"
            }, { status: 404 })
        }

        const tests = problem.judgeTestcases
        
        const { codeFilePath, outputFilePath, dirTest } = generateFiles(ext, code)
        removeDir = dirTest
        if(ext==="java" || ext==="cpp"){
            let res
            if(ext==="java"){
                res = await compileJava(codeFilePath) as {error: boolean, result: string}
            }
            else{
                res = await compileCpp(codeFilePath, outputFilePath) as {error: boolean, result: string}
            }
            if(res.error){
                // removeFiles(dirTest)
                //TODO: create submission
                setTimeout(() => {
                    fs.rm(dirTest, {recursive: true})
                }, 10000)
                const submission: Submission = {
                    id: Date.now().toString(),
                    userId: user._id as Types.ObjectId,
                    problemId: pid,
                    problemTitle: problem.title,
                    code,
                    language: ext,
                    verdict: "Compilation Error",
                    isCompiled: false,
                    outputStatus: [],
                    executionTime: 0,
                    memoryUsage: 0,
                    submissionTime: new Date()
                }
                user.submissions.push(submission)
                await user.save()
                return NextResponse.json({
                    success: true,
                    message: "Code Submitted Successfully",
                    verdict: "Compilation Error"
                }, { status: 200 })
            }
        }
        const results = await Promise.all(tests.map((test) => {
            const {inputFilePath} = generateInput(test.input, dirTest)
            // console.log(test.expectedOutput)
            try {
                let temp
                if(ext==="java"){
                    temp = runJava(inputFilePath, test.expectedOutput, dirTest) as Promise<{result: string, verdict: boolean, executionTime: number, memoryUsage: number, status: ('AC' | 'TLE' | 'MLE' | 'WA' | 'RE')}>
                }
                else if(ext==="cpp"){
                    temp = runCpp(inputFilePath, outputFilePath, test.expectedOutput) as Promise<{result: string, verdict: boolean, executionTime: number, memoryUsage: number, status: ('AC' | 'TLE' | 'MLE' | 'WA' | 'RE')}>
                }
                else if(ext==="py"){
                    temp = runPy(inputFilePath, codeFilePath, test.expectedOutput) as Promise<{result: string, verdict: boolean, executionTime: number, memoryUsage: number, status: ('AC' | 'TLE' | 'MLE' | 'WA' | 'RE')}>
                }
                else{
                    temp = runJS(inputFilePath, codeFilePath, test.expectedOutput) as Promise<{result: string, verdict: boolean, executionTime: number, memoryUsage: number, status: ('AC' | 'TLE' | 'MLE' | 'WA' | 'RE')}>
                }
                return temp
            } catch (error) {
                setTimeout(() => {
                    fs.rm(dirTest, {recursive: true, force: true})
                }, 10000)
                console.log(error)
                throw Error()
            }
            // return runCpp(inputFilePath, outputFilePath, test.expectedOutput) as Promise<{result: string, verdict: boolean, executionTime: number, memoryUsage: number, status: ('AC' | 'TLE' | 'MLE' | 'WA' | 'RE')}>
        }))
        setTimeout(() => {
            fs.rm(dirTest, {recursive: true, force: true})
        }, 10000)
        // console.log("here it is")
        // removeFiles(dirTest)
        let isAccepted = true
        let maxExecutionTime = 0;
        let maxMemoryUsage = 0
        let outputStatus: ('AC' | 'TLE' | 'MLE' | 'WA' | 'RE')[] = []
        for(const result of results) {
            isAccepted = isAccepted && result?.verdict
            maxExecutionTime = Math.max(maxExecutionTime, result.executionTime)
            maxMemoryUsage = Math.max(maxMemoryUsage, result.memoryUsage)
            outputStatus.push(result.status)
        }

        const submission: Submission = {
            id: Date.now().toString(),
            userId: user._id as Types.ObjectId,
            problemId: pid,
            problemTitle: problem.title,
            code,
            language: ext,
            verdict: isAccepted ? "Accepted" : "Not Accepted",
            isCompiled: true,
            outputStatus,
            executionTime: maxExecutionTime,
            memoryUsage: maxMemoryUsage,
            submissionTime: new Date()
        }

        user.submissions.push(submission)
        if(isAccepted) {
            let flag = true
            for(const username of problem.usersAccepted){
                if(username===user.username){
                    flag = false
                    break
                }
            }
            if(flag) problem.usersAccepted.push(user.username);
            flag = true
            for(const probId of user.solvedProblems){
                if(probId===pid){
                    flag=false
                    break
                }
            }
            if(flag) user.solvedProblems.push(pid)
        }

        await user.save()
        await problem.save()
        return NextResponse.json({
            success: true,
            message: "Code Submitted Successfully",
            verdict: isAccepted ? "Accepted" : "Not Accepted",
        }, {status: 200})

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false, 
            message: "Failed to submit code",
            verdict: "Internal Server Error",
        }, {status: 500})
    }
}

// export async function runTestcase(expectedOutput: string, outputFilePath: string, inputFilePath: string) {
//     return new Promise((resolve) => {
//         const worker = new Worker(__filename, {
//             workerData: {outputFilePath, inputFilePath},
//             // execArgv: ['--max-old-space-size='+MEMORY_LIMIT_MB]
//         })

//         // console.log(path.resolve(__dirname, "../../../../../executeCpp.ts"))

//         let testExecutionTime
//         let testMemoryUsage
//         const startTime = performance.now()
//         const startMemory = process.memoryUsage().heapUsed

//         const timeout = setTimeout(() => {
//             worker.terminate()
//             testMemoryUsage = process.memoryUsage().heapUsed - startMemory
//             resolve({
//                 verdict: false,
//                 executionTime: TIME_LIMIT_MS,
//                 memoryUsage: testMemoryUsage,
//                 status: 'TLE'
//             })
//         }, TIME_LIMIT_MS)

//         worker.on('message', (result) => {
//             clearTimeout(timeout)
//             testExecutionTime = performance.now() - startTime
//             testMemoryUsage = process.memoryUsage().heapUsed - startMemory
//             let verdict = false
//             let status = 'WA'
//             if(!result) {
//                 status = 'RE'
//             }
//             else if(normalizeString(expectedOutput) == normalizeString(result)){
//                 verdict = true
//                 status = 'AC'
//             }
//             resolve({
//                 verdict,
//                 executionTime: testExecutionTime,
//                 memoryUsage: testMemoryUsage,
//                 status
//             })
//         })

//         worker.on('error', (e) => {
//             console.log(e)
//             clearTimeout(timeout)
//             resolve({
//                 verdict: false,
//                 executionTime: performance.now() - startTime,
//                 memoryUsage: process.memoryUsage().heapUsed - startMemory,
//                 status: 'Internal Server Error'
//             })
//         })

//         worker.on('exit', (code) => {
//             if(code !== 0) {
//                 clearTimeout(timeout)
//                 resolve({
//                     verdict: false,
//                     executionTime: performance.now() - startTime,
//                     memoryUsage: MEMORY_LIMIT_MB*1024,
//                     status: 'MLE'
//                 })
//             }
//         })

//     })
// }

// if(!isMainThread) {
//     const {outputFilePath, inputFilePath} = workerData

//     (async () => {
//         try {
//             // Execute user code here (e.g., using a function that executes the code)
//             const result = await executeUserCode(inputFilePath, outputFilePath);
//             if(parentPort) parentPort.postMessage(result);
//         } catch (e) {
//             if(parentPort) parentPort.postMessage(null);
//         }
//     })();

// }