import * as mongoose from "mongoose";
import { IUser } from "../UserModule/User";

export interface IPointChange extends mongoose.Document {
    changedBy: IUser,
    changedTo: IUser,
    operation: string,
    ip_address: string,
    date_updated: Date,
    date_created: Date 
}

export const PointChangeSchema = new mongoose.Schema({
    changedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    changedTo: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    operation: {type: String, required: true},
    ip_address: {type: String, required: true},
    date_updated: {type: Date, default: Date.now},
    date_created: {type: Date, default: Date.now}
});

PointChangeSchema.pre<IPointChange>('save', function(next) {
    this.date_updated = new Date(Date.now());
    next();
});

const PointChange = mongoose.model<IPointChange>("PointChange", PointChangeSchema);

export default PointChange;