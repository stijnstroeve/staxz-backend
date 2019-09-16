import {ModuleMethod} from "../../ModuleMethod";
import {RequestType} from "../../RequestType";
import {ModuleRequest} from "../../ModuleRequest";
import {Error} from "../../../Error/Error";
import { ErrorType } from "../../../Error/ErrorType";
import User, { IUser } from "../../../Database/UserModule/User";

export class ChangePoints extends ModuleMethod {

    request: string = "changePoints";
    requestType: RequestType = RequestType.POST;
    requiredParameters: string[] = ["user_id", "change", "add"];
    needsAuth: boolean = true;

    async handle(request: ModuleRequest) {
        User.findOne({_id: request.parameters.user_id}, (error: any, user: any) => {
            if(error) {request.error(new Error(ErrorType.USER_NOT_FOUND, error)); return}
            if(!user) {request.error(new Error(ErrorType.USER_NOT_FOUND, error)); return}

            //User found, change points.
            const addPoints: boolean = request.parameters.add == "true";
            const changeAmount: number = parseInt(request.parameters.change);
            user.changePoints(changeAmount, addPoints, request.request.User, request.request.ip).then(() => {
                request.respond(null);
            }).catch((error: Error) => {
                request.error(error);
            });

        });

    }

}