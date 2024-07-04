import {z} from "zod"

export const titleValidation = z.string().min(2, "Problem Title must be atleast 2 characters long").max(50, "Problem Title must be atmost 50 characters long")

export const addProblemSchema = z.object({
    title: titleValidation,
    statement: z.string().min(10, "Problem Statement can't be so small"),
    constraints: z.string().min(1, "You need to provide some constraints"),
    sampleTestcases: z.array(z.object({
        input: z.string().min(1, "Input is empty"),
        expectedOutput: z.string().min(1, "Expected output is empty")
    })).nonempty("There should be atleast one sample testcase"),
    judgeTestcases: z.array(z.object({
        input: z.string().min(1, "Input is empty"),
        expectedOutput: z.string().min(1, "Expected output is empty")
    })).nonempty("There should be atleast one deciding testcase"),
    rating: z.string(),
    editorial: z.string().min(10, "Editorial is empty")
})