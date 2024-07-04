import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET (request: NextRequest) {
    const session = await getServerSession(authOptions)
    if(!session || !session.user){
        return NextResponse.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 402 })
    }
    await dbConnect()
    
    try {
        const user = await UserModel.findById(session.user._id, {submissions:1})
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