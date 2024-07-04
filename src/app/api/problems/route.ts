import ProblemModel from "@/models/Problem";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { changeSequence, getNextSequence } from "@/utils/getNextSequence";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
    await dbConnect()
    try {
        const problems = await ProblemModel
            .find({}, { _id: 1, id: 1, title: 1, rating: 1 })
            .sort({ id: 1 })

        return NextResponse.json({
            success: true,
            message: "Fetched problems successfully",
            problems
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error while fetching problems"
        }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    if(!session || !session.user){
        return NextResponse.json({
            success: false,
            message: "Not Authenticated"
        }, {status: 401})
    }

    if(!session.user.isAdmin) {
        return NextResponse.json({
            success: false,
            message: "Permission Denied"
        }, {status: 403})
    }

    const { title, statement, constraints, sampleTestcases, judgeTestcases, rating, editorial } = await request.json()

    if(!Number.isInteger(Number(rating)) || Number(rating)<100) {
        return NextResponse.json({
            success: false,
            message: "Rating should be an integer (>=100)"
        }, { status: 400 })
    }

    try {
        const existingProblemByTitle = await ProblemModel.findOne({ title })
        if (existingProblemByTitle) {
            return NextResponse.json({
                success: false,
                message: "Problem Title already used"
            }, { status: 400 })
        }
        
        const id = await getNextSequence('Problem')
        const authorId = new mongoose.Types.ObjectId(session.user._id)
        const processedRating = parseInt(rating)

        const newProblem = new ProblemModel({
            id,
            title,
            statement,
            constraints,
            sampleTestcases,
            judgeTestcases,
            rating: processedRating,
            editorial,
            author: authorId,
            createdAt: new Date()
        })
        
        await newProblem.save()
        await changeSequence('Problem')

        return NextResponse.json({
            success: true,
            message: "Problem has been submitted"
        }, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({
            success: false,
            message: error || "Failed to submit problem"
        }, { status: 500 })
    }
}