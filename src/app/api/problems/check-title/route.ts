import dbConnect from "@/lib/dbConnect";
import ProblemModel from "@/models/Problem";
import { z } from "zod"
import { titleValidation } from "@/schemas/addProblemSchema";
import { NextRequest, NextResponse } from "next/server";

const TitleQuerySchema = z.object({
    title: titleValidation
})

export async function GET(request: NextRequest) {

    await dbConnect()

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            title: searchParams.get('title')
        }
        
        // validate with zod
        const result = TitleQuerySchema.safeParse(queryParam)

        if(!result.success) {
            const titleErrors = result.error.format().title?._errors || []
            return NextResponse.json({
                success: false,
                message: titleErrors.length>0 ? titleErrors.join(', ') : 'Invalid query parameters',
            }, {status: 400})
        }

        const {title} = result.data

        const existingTitle = await ProblemModel.findOne({title})
        if(existingTitle) {
            return NextResponse.json({
                success: false,
                message: "Problem Title is already used, try something else"
            }, {status: 400})
        }

        return NextResponse.json({
            success: true,
            message: "Problem Title is available"
        }, {status: 200})

    } catch (error) {
        console.error("Error while checking problem title", error)
        return NextResponse.json({
            success: false,
            message: "Error while checking problem title"
        }, {status: 500})
    }
}