import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import axios from "axios";

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
        const resp = await axios.post(`${process.env.BACKEND_URL}/run`, {ext, code, input})

        return NextResponse.json({
            success: resp.data.success,
            message: resp.data.message,
            output: resp.data.output,
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Internal Server Error',
            output: 'Internal Server Error'
        }, { status: 500 })
    }
}