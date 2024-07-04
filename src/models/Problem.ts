import { getNextSequence } from "@/utils/getNextSequence";
import mongoose, { Schema, Document, Types } from "mongoose";

export interface Testcase extends Document {
    input: string;
    expectedOutput: string;
}

const TestcaseSchema: Schema<Testcase> = new Schema({
    input: {
        type: String,
        required: [true, "Input is required"]
    },
    expectedOutput: {
        type: String,
        required: [true, "Output is required"]
    },
})

export interface Problem extends Document {
    id: number
    title: string
    statement: string
    constraints: string
    sampleTestcases: Testcase[]
    judgeTestcases: Testcase[]
    rating: number
    usersAccepted: string[]
    editorial: string
    author: Types.ObjectId
    createdAt: Date
}

const ProblemSchema: Schema<Problem> = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: [true, "Problem Title is required"],
        unique: true,
    },
    statement: {
        type: String,
        required: [true, "Problem Statement is required"],
    },
    constraints: {
        type: String,
        required: [true, "Constraints are required"],
    },
    sampleTestcases: {
        type: [TestcaseSchema],
        validate: {
            validator: function (v: Testcase[]) {
                return v.length > 0; // Ensure there is at least one testcase
            },
            message: 'A problem must have at least one testcase.',
        }
    },
    judgeTestcases: {
        type: [TestcaseSchema],
        validate: {
            validator: function (v: Testcase[]) {
                return v.length > 0; // Ensure there is at least one testcase
            },
            message: 'A problem must have at least one testcase.',
        }
    },
    rating: {
        type: Number,
        required: true,
    },
    usersAccepted: [
        { type: String, ref: 'User' },
    ],
    editorial: {
        type: String,
        required: [true, "Editorial is required"]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const ProblemModel = (mongoose.models.Problem as mongoose.Model<Problem>) || mongoose.model<Problem>("Problem", ProblemSchema)

export default ProblemModel
