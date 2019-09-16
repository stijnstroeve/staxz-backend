import PermissionLevel from "../../../../Database/UserModule/PermissionLevel";
import {ModuleRequest} from "../../../ModuleRequest";
import {ModuleMethod} from "../../../ModuleMethod";
import {RequestType} from "../../../RequestType";
import {ErrorType} from "../../../../Error/ErrorType";
import {Error} from "../../../../Error/Error";
import User from "../../../../Database/UserModule/User";

export class SetUserPermissionLevel extends ModuleMethod {

    request: string = "setUserPermissionLevel";
    requestType: RequestType = RequestType.POST;
    requiredParameters: string[] = ["user_id", "level"];
    needsAuth: boolean = true;

    async handle(request: ModuleRequest) {
        User.findOne({_id: request.parameters.user_id}, (error: any, user: any) => {
            if(error) {request.error(new Error(ErrorType.USER_NOT_FOUND, error)); return}
            if(!user) {request.error(new Error(ErrorType.USER_NOT_FOUND, error)); return}

            PermissionLevel.findOne({level: request.parameters.level}, (error, level: any) => {
                if(error) {request.error(new Error(ErrorType.RANK_NOT_FOUND, error, [{name: "LEVEL", variable: request.parameters.level}]));return}

                User.updateOne({_id: request.parameters.user_id}, {level: level._id}, (error, level: any) => {
                    if(error) {request.error(new Error(ErrorType.UNKNOWN, error)); return}

                    request.respond(null);
                });

            });
        });

    }

}