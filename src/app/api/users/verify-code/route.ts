import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect()

    try {
        const {username, code} = await request.json()
        const user = await UserModel.findOne({
            username
        })

        if(!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, {status: 400})
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()
            return NextResponse.json({
                success: true,
                message: "Account verified successfully. You can login now"
            }, {status: 200})
        }
        else if(!isCodeNotExpired) {
            return NextResponse.json({
                success: false,
                message: "Verification Code expired. Sign up again to get a new code"
            }, {status: 400})
        }
        else {
            return NextResponse.json({
                success: false,
                message: "Incorrect verification code"
            }, {status: 400})
        }

    } catch (error) {
        console.error("Error while checking verify code")
        return NextResponse.json({
            success: false,
            message: "Error while checking verify code"
        }, {status: 500})
    }
}