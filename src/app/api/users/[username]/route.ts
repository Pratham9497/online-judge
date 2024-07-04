import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params: {username}}: {params: {username: string}}) {
    await dbConnect()
    try {
        const user = await UserModel.findOne({username, isVerified: true})
        if(!user) {
            return NextResponse.json({
                success: false,
                message: "User Not Found"
            }, {status: 404})
        }

        return NextResponse.json({
            success: true,
            message: "User Found",
            user,
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, {status: 500})
    }
}