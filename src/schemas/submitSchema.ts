import {z} from "zod"

export const submitSchema = z.object({
    code: z.string()
})

