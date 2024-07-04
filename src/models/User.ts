import mongoose, { Schema, Document, Types } from "mongoose";
import { Testcase } from "./Problem";
import { number } from "zod";

export interface Submission {
    id: string
    userId: Types.ObjectId;
    problemId: number;
    problemTitle: string
    code: string;
    language: 'js' | 'py' | 'java' | 'cpp' | 'ts';
    verdict: 'Accepted' | 'Not Accepted' | 'Compilation Error';
    isCompiled: boolean
    outputStatus: ('AC' | 'WA' | 'TLE' | 'RE' | 'MLE')[]
    executionTime: number;
    memoryUsage: number;
    submissionTime: Date;
}

const SubmissionSchema: Schema<Submission> = new Schema({
    id: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    problemId: {
        type: Number,
        required: true,
        ref: 'Problem',
    },
    problemTitle: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    verdict: {
        type: String,
        required: true
    },
    isCompiled: {
        type: Boolean,
        default: true,
    },
    outputStatus: {
        type: [String],
    },
    executionTime: {
        type: Number,
        required: true,
    },
    memoryUsage: {
        type: Number,
        required: true,
    },
    submissionTime: {
        type: Date,
        default: new Date(),
    },
})

export interface User extends Document {
    username: string
    firstname: string
    lastname: string
    email: string
    password: string
    isAdmin: boolean
    verifyCode: string
    verifyCodeExpiry: Date
    isVerified: boolean
    solvedProblems: number[]
    submissions: Submission[]
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        unique: true,
        required: [true, "Username is required"],
        trim: true,
    },
    firstname: {
        type: String,
        required: [true, "First name is required"],
    },
    lastname: {
        type: String,
        required: [true, "Last name is required"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        match: [/.+\@.+\..+/, "Please use a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    solvedProblems: [
        { type: Number, ref: 'Problem' }
    ],
    submissions: [
        SubmissionSchema
    ],

})


const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel