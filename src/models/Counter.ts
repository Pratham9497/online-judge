import mongoose, { Schema, Document, Types } from "mongoose";

export interface Counter extends Document {
    modelName: string
    seq: number
}

const CounterSchema: Schema<Counter> = new Schema({
    modelName: {
        type: String,
        unique: true,
    },
    seq: {
        type: Number,
        default: 0,
    }
});

const CounterModel = (mongoose.models.Counter as mongoose.Model<Counter>) || mongoose.model<Counter>("Counter", CounterSchema)

export default CounterModel