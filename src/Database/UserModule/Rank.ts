import * as mongoose from "mongoose";

export interface IRank extends mongoose.Document {
    level: number,
    name: string,
    permissions: string[]
}

export const RankSchema = new mongoose.Schema({
    level: {type: Number, required: true, unique: true},
    name: {type: String, required: true, unique: true},
    permissions: [{type: String}]
});

const Rank = mongoose.model<IRank>("Rank", RankSchema);

export default Rank;