import {z} from "zod"

export const compileSchema = z.object({
    code: z.string()
})