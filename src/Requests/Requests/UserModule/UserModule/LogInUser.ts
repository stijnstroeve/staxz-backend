import {ModuleRequest} from "../../../ModuleRequest";
import {RequestType} from "../../../RequestType";
import {Error} from "../../../../Error/Error";
import {ModuleMethod} from "../../../ModuleMethod";
import {ErrorType} from "../../../../Error/ErrorType";
import User from "../../../../Database/UserModule/User";
import UserInfo, { IUserInfo } from "../../../../Database/UserModule/UserInfo";

export class LogInUser extends ModuleMethod {

    request: string = "logInUser";
    requestType: RequestType = RequestType.POST;
    requiredParameters: string[] = ["email", "password"];
    needsAuth: boolean = false;

    async handle(request: ModuleRequest) {
        let accessToken = request.request.token;
        if(accessToken) {
            User.findByToken(accessToken).then((result: any) => {
                request.respond(result);
            }).catch((error: Error) => {
                request.error(error);
            });
            return;
        }
        let email = request.parameters.email;
        let password = request.parameters.password;

        UserInfo.findOne({email, password}, (error: any, userInfo: IUserInfo) => {
            if(error) {request.error(new Error(ErrorType.UNKNOWN, error)); return}
            if(!userInfo) {request.error(new Error(ErrorType.USER_NOT_FOUND, error)); return}
            //UserInfo found, find the User and generate new access tokens.

            User.findOne({user_info: userInfo._id}, async (error: any, user: any) => {
                if(error) {request.error(new Error(ErrorType.UNKNOWN, error)); return}
                if(!user) {request.error(new Error(ErrorType.USER_NOT_FOUND, error)); return}

                let token = await user.generateTokens();
                if(!token) {if(error) {request.error(new Error(ErrorType.UNKNOWN, error)); return}}
                request.respond({token: token});
            });

        });


    }

}