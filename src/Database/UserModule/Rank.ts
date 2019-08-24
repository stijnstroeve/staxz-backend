import * as mongoose from "mongoose";
import {Error} from "../../Error/Error";
import {ErrorType} from "../../Error/ErrorType";

export interface IRank extends mongoose.Document {
    level: number,
    name: string,
    permissions: string[]
}

export interface IRankFunctions extends mongoose.Model<IRank> {
    getLevel(level: number): Promise<IRank>;
}

export const RankSchema = new mongoose.Schema({
    level: {type: Number, required: true, unique: true},
    name: {type: String, required: true, unique: true},
    permissions: [{type: String}]
});

RankSchema.statics.getLevel = function(level: number): Promise<IRank> {
    return new Promise<any>((resolve, reject) => {
        Rank.findOne({level: level}, (error: any, rank: IRank) => {
            if(error) return reject(new Error(ErrorType.RANK_NOT_FOUND, error));
            if(!rank) return reject(new Error(ErrorType.RANK_NOT_FOUND, error));

            resolve(rank);
        });
    })
};

const Rank = mongoose.model<IRank, IRankFunctions>("Rank", RankSchema);

export default Rank;