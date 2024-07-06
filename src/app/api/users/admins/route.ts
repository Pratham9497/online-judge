import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";


export async function GET (request: NextRequest) {
    await dbConnect()

    try {
        const admins = await UserModel.find({isAdmin: true}, {username: 1, firstname: 1, lastname: 1, email: 1})
        return NextResponse.json({
            success: false,
            message: "Fetched Admins successfully",
            admins
        }, {status: 200})
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error",
        }, {status: 500})
    }
}

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
        if(user.isAdmin){
            return NextResponse.json({
                success: false,
                message: "User is already Admin"
            }, {status: 400})
        }
        user.isAdmin = true
        await user.save()

        return NextResponse.json({
            success: true,
            message: `${username} is admin now`
        }, {status: 200})
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, {status: 500})
    }
}