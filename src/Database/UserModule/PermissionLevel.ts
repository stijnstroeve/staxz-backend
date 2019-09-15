import * as mongoose from "mongoose";
import {Error} from "../../Error/Error";
import {ErrorType} from "../../Error/ErrorType";

export interface IPermissionLevel extends mongoose.Document {
    level: number,
    name: string,
    permissions: string[],
    date_updated: Date,
    date_created: Date
}

export interface IPermissionLevelFunctions extends mongoose.Model<IPermissionLevel> {
    getLevel(level: number): Promise<IPermissionLevel>;
}

export const PermissionLevelSchema = new mongoose.Schema({
    level: {type: Number, required: true, unique: true},
    name: {type: String, required: true, unique: true},
    permissions: [{type: String}],
    date_updated: {type: Date, default: Date.now},
    date_created: {type: Date, default: Date.now}
});

PermissionLevelSchema.pre<IPermissionLevel>('save', function(next) {
    this.date_updated = new Date(Date.now());
    next();
});

PermissionLevelSchema.statics.getLevel = function(level: number): Promise<IPermissionLevel> {
    return new Promise<IPermissionLevel>((resolve, reject) => {
        PermissionLevel.findOne({level: level}, (error: any, level: IPermissionLevel) => {
            if(error) return reject(new Error(ErrorType.RANK_NOT_FOUND, error));
            if(!level) return reject(new Error(ErrorType.RANK_NOT_FOUND, error));

            resolve(level);
        });
    })
};

const PermissionLevel = mongoose.model<IPermissionLevel, IPermissionLevelFunctions>("PermissionLevel", PermissionLevelSchema);

export default PermissionLevel;