import dbConnect from '@/lib/dbConnect'
import UserModel from '@/models/User'
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from '@/utils/sendVerificationMail'
import { NextRequest, NextResponse } from 'next/server'
import { signUpSchema } from '@/schemas/signUpSchema'

// const SignUpQuerySchema = z.object({
//     username: usernameValidation
// })

export async function POST(request: NextRequest) {
    await dbConnect()

    try {
        const { username, firstname, lastname, email, password } = await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername) {
            return NextResponse.json({
                success: false,
                message: "Username is already registered"
            }, { status: 400 })
        }

        await UserModel.deleteOne({ username })
        const existingUserByEmail = await UserModel.findOne({ email })

        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: "Email is already registered"
                }, { status: 400 })
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.username = username
                existingUserByEmail.firstname = firstname
                existingUserByEmail.lastname = lastname
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                firstname,
                lastname,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                solvedProblems: [],
                submissions: [],
            })

            await newUser.save()
        }

        // send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode)
        console.log(emailResponse)
        if(!emailResponse.success) {
            return NextResponse.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }

        return NextResponse.json({
            success: true,
            message: "User registered successfully. Please verify your email"
        }, {status: 201})

    } catch (error) {
        console.error("Error while registering user")
        return NextResponse.json({
            success: false,
            message: "Failed to register user"
        }, { status: 500 })
    }
}

// connect()

// type UserData = {
//     firstname: string
//     lastname: string
//     email: string
//     password: string
// }

// export async function POST (request: NextRequest) {
//     try {
//         const reqBody = await request.json()
//         const {firstname, lastname, email, password}: UserData = reqBody

//         const user = await User.findOne({email})

//         if(user) {
//             return NextResponse.json({error: "User already exists"}, {status: 400})
//         }

//         const salt = await bcryptjs.genSalt(10)
//         const hashedPassword = await bcryptjs.hash(password, salt)

//         const newUser = new User({
//             firstname,
//             lastname,
//             username: (firstname+lastname).toLowerCase(),
//             email,
//             password: hashedPassword
//         })

//         const savedUser = await newUser.save()

//         console.log(savedUser)

//         // send verification mail

//         await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})

//         return NextResponse.json({
//             message: "User registered successfully",
//             success: true,
//             savedUser
//         })

//     } catch (error: any) {
//         return NextResponse.json({error: error.message}, {status: 500})
//     }
// }
