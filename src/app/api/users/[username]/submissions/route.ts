import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET (request: NextRequest, {params: {username}}: {params: {username: string}}) {
    await dbConnect()
    
    try {
        const user = await UserModel.findOne({username, isVerified: true}, {submissions:1})
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not registered"
            }, { status: 404 })
        }
        const submissions = user.submissions.sort((a, b) => new Date(b.submissionTime).getTime() - new Date(a.submissionTime).getTime())

        return NextResponse.json({
            success: true,
            submissions,
            message: "Submissions fetched successfully"
        }, {status: 200})

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, {status: 500})
    }
}