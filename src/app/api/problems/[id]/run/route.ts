import { NextRequest, NextResponse } from "next/server";
import { generateFiles, generateInput } from "@/utils/generateFiles";
import { compileCpp, runCpp, runJS, runPy, compileJava, runJava } from "@/utils/executeCode";
import { getServerSession } from "next-auth";
import fs from 'fs/promises'

export async function POST(request: NextRequest) {
    const session = await getServerSession()
    if(!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "Not Authenticated",
        }, {status: 402})
    }
    const { input, ext, code } = await request.json()
    try {
        const { codeFilePath, outputFilePath, dirTest } = generateFiles(ext, code)
        if(ext === "java" || ext==="cpp"){
            let res
            if(ext==="java"){
                res = await compileJava(codeFilePath) as {error: boolean, result: string}
            }
            else{
                res = await compileCpp(codeFilePath, outputFilePath) as {error: boolean, result: string}
            }

            if(res.error) {
                setTimeout(() => {
                    fs.rm(dirTest, {recursive: true, force: true})
                }, 10000)
                return NextResponse.json({
                    success: true,
                    message: "Code output",
                    output: res.result.length!=0 ? res.result : "Compilation Error",
                }, { status: 200 })
            }
        }
        const { inputFilePath } = generateInput(input, dirTest)
        let output
        if(ext==="java"){
            output = await runJava(inputFilePath, "", dirTest) as {result: string | null, verdict: boolean, executionTime: number, memoryUsage: number, status: ('AC' | 'TLE' | 'MLE' | 'WA' | 'RE')}
        }
        else if(ext==="cpp"){
            output = await runCpp(inputFilePath, outputFilePath, "") as {result: string | null, verdict: boolean, executionTime: number, memoryUsage: number, status: ('AC' | 'TLE' | 'MLE' | 'WA' | 'RE')}
        }
        else if(ext==="py"){
            output = await runPy(inputFilePath, codeFilePath, "") as {result: string | null, verdict: boolean, executionTime: number, memoryUsage: number, status: ('AC' | 'TLE' | 'MLE' | 'WA' | 'RE')}
        }
        else{
            output = await runJS(inputFilePath, codeFilePath, "") as {result: string | null, verdict: boolean, executionTime: number, memoryUsage: number, status: ('AC' | 'TLE' | 'MLE' | 'WA' | 'RE')}
        }
        setTimeout(() => {
            fs.rm(dirTest, {recursive: true, force: true})
        }, 10000)
        // console.log("here again")

        return NextResponse.json({
            success: true,
            message: "Code output",
            output: output.status==="TLE" ? "Time Limit Exceeded" : output.result ? output.result : "",
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Internal Server Error',
            output: 'Internal Server Error'
        }, { status: 500 })
    }
}