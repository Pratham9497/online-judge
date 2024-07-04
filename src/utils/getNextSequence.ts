import CounterModel from "@/models/Counter";

export async function getNextSequence(modelName: string) {
    const counter = await CounterModel.findOne(
        { modelName: modelName },
    );
    return counter?.seq as number + 1;
}

export async function changeSequence(modelName: string) {
    const counter = await CounterModel.findOneAndUpdate(
        { modelName: modelName },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
}