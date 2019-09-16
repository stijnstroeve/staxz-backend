import * as mongoose from "mongoose";
import { IPointChange } from "./PointChange";

export interface IPointsInfo extends mongoose.Document {
    points: number,
    points_given: number,
    point_changes: IPointChange[],
    date_updated: Date,
    date_created: Date 
}

export const PointsInfoSchema = new mongoose.Schema({
    points: {type: Number, default: 0},
    points_given: {type: Number, default: 0},
    point_changes: [{type: mongoose.Schema.Types.ObjectId, ref: 'PointChange', required: true}],
    date_updated: {type: Date, default: Date.now},
    date_created: {type: Date, default: Date.now}
});

PointsInfoSchema.pre<IPointsInfo>('save', function(next) {
    this.date_updated = new Date(Date.now());
    next();
});

const PointsInfo = mongoose.model<IPointsInfo>("PointsInfo", PointsInfoSchema);

export default PointsInfo;