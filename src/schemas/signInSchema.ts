import {z} from "zod"

export const signInSchema = z.object({
    identifier: z.string().min(1, "Username is empty"),
    password: z.string().min(1, "Password is empty"),
})

