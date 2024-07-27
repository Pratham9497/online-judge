import UserModel from "@/models/User";
import ProblemModel, { Problem } from "@/models/Problem";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET (request: NextRequest, {params: {id}}: {params: {id: string}}) {
    await dbConnect()
    
    try {
        if(!Number.isInteger(Number(id))){
            return NextResponse.json({
                success: false,
                message: "Invalid Params"
            }, { status: 404 }) 
        }
        const pid = parseInt(id)
        const problem = await ProblemModel.findOne({id: pid})
        if(!problem) {
            return NextResponse.json({
                success: false,
                message: "Problem Not found"
            }, {status: 404})
        }
        const author = await UserModel.findById(problem.author, {username: 1})
        const authorUsername = author?.username
        return NextResponse.json({
            success: true,
            problem: {...problem.toObject(), author: problem.author.toString()},
            authorUsername,
            message: "Problem Found"
        }, {status: 200})

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error
        }, {status: 500})
    }
}