import { z } from "zod";

export const usernameValidation = z
    .string()
    .trim()
    .min(6, "Username must be atleast 6 characters")
    .max(20, "Username must be atmost 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")

export const signUpSchema = z.object({
    firstname: z.string().min(2, "First name must be atleast 2 characters long").max(20, "First name must be atmost 20 characters long"),
    lastname: z.string().min(2, "Last name must be atleast 2 characters long").max(20, "Last name must be atmost 20 characters long"),
    username: usernameValidation,
    email: z.string().email({message: "Invalid Email Address"}),
    password: z.string()
        .min(6, {message: "Password must be atleast 6 characters"})
        .max(30, {message: "Password must be atmost 30 characters"})
        .regex(/^(?=.*[A-Z])(?=.*[\W_])(?=.*\d).+$/, {
            message: "Password must contain at least one uppercase letter, one special character, and one number" 
        })
})