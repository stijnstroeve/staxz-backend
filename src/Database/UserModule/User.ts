import * as mongoose from "mongoose";
import * as jwt from "jsonwebtoken";
import config from "../../../config/config.json";
import pconfig from "../../../config/private-config.json";
import Mongo from "../Mongo";
import Logger from "../../Logger/Logger";
import {LogType} from "../../Logger/LogType";
import {ErrorType} from "../../Error/ErrorType";
import {Error} from "../../Error/Error";
import PermissionLevel, {IPermissionLevel} from "./PermissionLevel";
import UserInfo, {IUserInfo} from "./UserInfo.js";
import { IAddressInfo } from "./AddressInfo.js";
import PointsInfo, { IPointsInfo } from "../PointsModule/PointsInfo.js";
import PointChange, { IPointChange } from "../PointsModule/PointChange.js";

export interface SimpleUser {
    level: number,
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    password: string,
    phone_number: string,
    current_ip: string
}

export interface IUser extends mongoose.Document {
    user_info: IUserInfo,
    user_address: IAddressInfo,
    level: IPermissionLevel,
    points_info: IPointsInfo,
    tokens: {access: string, refresh: string}[],
    blocked: boolean,
    ip_address_registered: string,
    ip_address_last_login: string,
    last_logged_in: Date,
    date_updated: Date,
    date_created: Date
}

export interface IUserFunctions extends mongoose.Model<IUser> {
    findByToken(accessToken: string): Promise<any>;
    refreshToken(refreshToken: string): Promise<any>;
    createUser(simpleUser: SimpleUser): Promise<any>;
}

export const UserSchema = new Mongo.mongoose.Schema({
    user_info: {type: mongoose.Schema.Types.ObjectId, ref: 'UserInfo', required: true},
    user_address: {type: mongoose.Schema.Types.ObjectId, ref: 'AddressInfo', required: false},
    level: {type: mongoose.Schema.Types.ObjectId, ref: 'PermissionLevel', required: true},
    points_info: {type: mongoose.Schema.Types.ObjectId, ref: 'PointsInfo', required: true},
    tokens: [{access: {type: String, required: true}, refresh: {type: String, required: true}}],
    blocked: {type: Boolean, default: false},
    ip_address_registered: {type: String, default: "0.0.0.0"},
    ip_address_last_login: {type: String, default: "0.0.0.0"},
    last_logged_in: {type: Date, default: Date.now},
    date_updated: {type: Date, default: Date.now},
    date_created: {type: Date, default: Date.now}
});

UserSchema.pre<IUser>('save', function(next) {
    this.date_updated = new Date(Date.now());
    next();
});

UserSchema.methods.changePoints = async function(changeAmount: number, add: boolean, byUser: IUser, ipAddress: string): Promise<any> { //This isn"t an arrow function because this is needed in this context.
    return new Promise<any>((resolve, reject) => {
        PointsInfo.findOne({_id: this.points_info}, (error: any, pointsInfo: IPointsInfo) => {
            if(error) {reject(new Error(ErrorType.UNKNOWN, error)); return}
            if(!pointsInfo) {reject(new Error(ErrorType.ERROR_FINDING_POINTS, error)); return} //TODO Not found? Create pointsinfo

            let prefix = add ? "+" : "-";
            let operation = prefix + changeAmount;

            let pointChange = new PointChange({
                changedBy: byUser._id,
                changedTo: this._id,
                operation: operation,
                ip_address: ipAddress 
            });

            pointChange.save((error: any, pointChange: IPointChange) => {
                if(error) {reject(new Error(ErrorType.UNKNOWN, error)); return}
                if(!pointChange) {reject(new Error(ErrorType.UNKNOWN, error)); return}

                let newChangeArray = pointsInfo.point_changes;
                newChangeArray.push(pointChange._id);

                PointsInfo.updateOne({_id: pointsInfo._id}, {point_changes: newChangeArray, points: add ? (pointsInfo.points + changeAmount) : (pointsInfo.points - changeAmount)}, (error: any) => {
                    if(error) {reject(new Error(ErrorType.UNKNOWN, error)); return}
    
                    resolve();
                });
            })
        });
    });
}

UserSchema.methods.generateTokens = async function() { //This isn"t an arrow function because this is needed in this context.
    let accessToken: string = jwt.sign({_id: this._id.toString()}, pconfig.PRIVATE_ACCESS_TOKEN_KEY, {
        expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME,
        algorithm: "HS256"
    });
    let refreshToken: string = jwt.sign({_id: this._id.toString()}, pconfig.PRIVATE_REFRESH_TOKEN_KEY, {
        expiresIn: config.REFRESH_TOKEN_EXPIRE_TIME,
        algorithm: "HS256"
    });

    this.tokens.push({access: accessToken, refresh: refreshToken});

    try {
        await this.save();
        return {accessToken: accessToken, refreshToken: refreshToken};
    } catch(error) {
        Logger.logType(LogType.ERROR, error);
        return null;
    }
};

UserSchema.statics.createUser = async function(simpleUser: SimpleUser): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        PermissionLevel.getLevel(simpleUser.level ? simpleUser.level : 0).then((level) => {
            let userInfo = new UserInfo({
                firstname: simpleUser.firstname,
                lastname: simpleUser.lastname,
                username: simpleUser.username,
                email: simpleUser.email,
                password: simpleUser.password,
                phone_number: simpleUser.phone_number
            });
            userInfo.save((error: any, info: IUserInfo) => {
                if(error) {
                    if(error.code === 11000 || error.code === 11001) {
                        reject(new Error(ErrorType.USER_ALREADY_EXISTS, error)); return;
                    }
                    reject(new Error(ErrorType.UNKNOWN, error)); return;
                }
                let pointsInfo = new PointsInfo({
                    points: 0,
                    points_given: 0,
                    point_changes: []
                });
                pointsInfo.save((error: any, pointsInfo: IPointsInfo) => {
                    if(error) {reject(new Error(ErrorType.UNKNOWN, error)); return}
                    let user = new User({
                        user_info: info._id,
                        level: level._id,
                        points_info: pointsInfo._id,
                        tokens: [],
                        ip_address_registered: simpleUser.current_ip
                    });
                    user.save((error: any) => {
                        if(error) {reject(new Error(ErrorType.UNKNOWN, error)); return}
                        
                        resolve();
                    });
                });
            });
        }).catch((error: Error) => {
            reject(error);
        });
    });

}

UserSchema.statics.refreshToken = async function(refreshToken: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        let decodedRefreshToken: any;

        try {
            decodedRefreshToken = jwt.verify(refreshToken, pconfig.PRIVATE_REFRESH_TOKEN_KEY);
            const exp = decodedRefreshToken.exp;
            if(!exp) {
                return reject(new Error(ErrorType.NO_EXP_DATE_TOKEN));
            }
        } catch (error) {
            if(error.name === "TokenExpiredError") {
                console.log("Refresh token expired " + refreshToken);
                return reject(new Error(ErrorType.TOKEN_EXPIRED, error));
            }
            return reject(new Error(ErrorType.INVALID_TOKEN_SIGNATURE, error));
        }

        let accessToken: string = jwt.sign({_id: decodedRefreshToken._id.toString()}, pconfig.PRIVATE_ACCESS_TOKEN_KEY, {
            expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME,
            algorithm: "HS256"
        });

        User.updateOne({_id: decodedRefreshToken._id, "tokens.refresh": refreshToken}, {"$set": {"tokens.$.access": accessToken}}, (error: any) => {
            if(error) return reject(new Error(ErrorType.UNKNOWN, error));
        });

        resolve(accessToken);
    })

};

UserSchema.statics.findByToken = function(accessToken: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        let decodedAccessToken: any;

        try {
            decodedAccessToken = jwt.verify(accessToken, pconfig.PRIVATE_ACCESS_TOKEN_KEY);
            const exp = decodedAccessToken.exp;
            if(!exp) {
                return reject(new Error(ErrorType.NO_EXP_DATE_TOKEN));
            }
        } catch (error) {
            if(error.name === "TokenExpiredError") {
                console.log("Token expired " + accessToken);
                return reject(new Error(ErrorType.TOKEN_EXPIRED, error));
            }
            return reject(new Error(ErrorType.INVALID_TOKEN_SIGNATURE, error));
        }

        User.findOne({"_id": decodedAccessToken._id, "tokens.access": accessToken})
            .populate('level')
            .exec((error: any, user: IUser) => {
                if(error) return reject(new Error(ErrorType.UNKNOWN, error));
                if(!user) return reject(new Error(ErrorType.NO_PERMISSION, error));

                console.log(user);
                resolve(user);
            });
    })
};

const User = Mongo.mongoose.model<IUser, IUserFunctions>("User", UserSchema);

export default User;