import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest) {
    await dbConnect()
    const {username} = await request.json()
    const session = await getServerSession(authOptions)
    if(!session || !session.user){
        return NextResponse.json({
            success: false,
            message: "Not Authenticated"
        }, {status: 402})
    }

    if(!session.user.isSuperAdmin){
        return NextResponse.json({
            success: false,
            message: "Permission Denied"
        }, {status: 403})
    }
    try {
        const user = await UserModel.findOne({username, isVerified: true})
        if(!user){
            return NextResponse.json({
                success: false,
                message: "User Not Found"
            }, {status: 404})
        }
        if(!user.isAdmin){
            return NextResponse.json({
                success: false,
                message: "User is already not an admin"
            }, {status: 400})
        }
        user.isAdmin = false
        await user.save()

        return NextResponse.json({
            success: true,
            message: `${username} is not an admin now`
        }, {status: 200})
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, {status: 500})
    }
}