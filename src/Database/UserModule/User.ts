import * as mongoose from "mongoose";
import * as jwt from "jsonwebtoken";
import config from "../../../config/config.json";
import pconfig from "../../../config/private-config.json";
import Mongo from "../Mongo";
import Logger from "../../Logger/Logger";
import {LogType} from "../../Logger/LogType";
import {ErrorType} from "../../Error/ErrorType";
import {Error} from "../../Error/Error";
import Rank, {IRank} from "./Rank";

export interface IUser extends mongoose.Document {
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    password: string,
    phone_number: string,
    tokens: {access: string, refresh: string}[],
    rank: IRank,
    date_updated: Date,
    date_created: Date
}

export interface IUserFunctions extends mongoose.Model<IUser> {
    findByToken(accessToken: string): Promise<any>;
    refreshToken(refreshToken: string): Promise<any>;
}

export const UserSchema = new Mongo.mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    phone_number: {type: String, required: true},
    tokens: [{access: {type: String, required: true}, refresh: {type: String, required: true}}],
    rank: {type: mongoose.Schema.Types.ObjectId, ref: 'Rank', required: true},
    date_updated: {type: Date, default: Date.now},
    date_created: {type: Date, default: Date.now}
});

UserSchema.pre<IUser>('save', function(next) {
    this.date_updated = new Date(Date.now());
    next();
});

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

        User.updateOne({"_id": decodedRefreshToken._id, "tokens.refresh": refreshToken}, {"$set": {"tokens.$.access": accessToken}}, (error: any) => {
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
            .populate('rank')
            .exec((error: any, user: IUser) => {
                if(error) return reject(new Error(ErrorType.UNKNOWN, error));

                resolve(user);
            });
    })
};

const User = Mongo.mongoose.model<IUser, IUserFunctions>("User", UserSchema);

export default User;