import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Username or Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })

                    if (!user) {
                        throw new Error('Incorrect username or password')
                    }

                    if (!user.isVerified) {
                        throw new Error('User is not verified')
                    }

                    const isCorrect = await bcrypt.compare(credentials.password, user.password)

                    if (isCorrect) {
                        return user
                    }
                    else {
                        throw new Error('Incorrect username or Password')
                    }

                } catch (err: any) {
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if(user) {
                token._id = user._id?.toString()
                token.username = user.username
                token.isVerified = user.isVerified
                token.isAdmin = user.isAdmin
                token.isSuperAdmin = user.isSuperAdmin
            }
            return token
        },
        async session({ session, token }) {
            if(token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.username = token.username
                session.user.isAdmin = token.isAdmin
                session.user.isSuperAdmin = token.isSuperAdmin
            }
            return session
        },
    },
    pages: {
        signIn: '/login'
    },
    theme: {
        colorScheme: "dark"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}
