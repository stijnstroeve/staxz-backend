import * as mongoose from "mongoose";

export interface IUserInfo extends mongoose.Document {
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    password: string,
    phone_number: string,
    profile_picture: string,
    date_updated: Date,
    date_created: Date
}

export const UserInfoSchema = new mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    phone_number: {type: String, required: true},
    profile_picture: {type: String, required: false},
    date_updated: {type: Date, default: Date.now},
    date_created: {type: Date, default: Date.now}
});

UserInfoSchema.pre<IUserInfo>('save', function(next) {
    this.date_updated = new Date(Date.now());
    next();
});

const UserInfo = mongoose.model<IUserInfo>("UserInfo", UserInfoSchema);

export default UserInfo;