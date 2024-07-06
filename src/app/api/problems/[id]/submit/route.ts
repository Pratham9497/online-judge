import UserModel, { Submission } from "@/models/User";
import ProblemModel from "@/models/Problem";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Types } from "mongoose";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import axios from "axios";

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

        const resp = await axios.post(`${process.env.BACKEND_URL}/submit`, {ext, code, tests})
        if(!resp.data.isCompiled){
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
        const results = resp.data.results as {result: string, verdict: boolean, executionTime: number, memoryUsage: number, status: ('AC' | 'TLE' | 'MLE' | 'WA' | 'RE')}[]
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