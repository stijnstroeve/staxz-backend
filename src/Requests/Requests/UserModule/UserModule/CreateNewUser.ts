import {ModuleRequest} from "../../../ModuleRequest";
import {RequestType} from "../../../RequestType";
import {ModuleMethod} from "../../../ModuleMethod";
import {Error} from "../../../../Error/Error";
import User from "../../../../Database/UserModule/User";
import PermissionLevel, {IPermissionLevel} from "../../../../Database/UserModule/PermissionLevel";
import {ErrorType} from "../../../../Error/ErrorType";

export class CreateNewUser extends ModuleMethod {

    request: string = "createNewUser";
    requestType: RequestType = RequestType.POST;
    requiredParameters: string[] = ["firstname", "lastname", "username", "email", "password", "phone_number"];
    notRequiredParameters: string[] = ["level"];
    needsAuth: boolean = true;

    handle(request: ModuleRequest) {
        PermissionLevel.getLevel(request.parameters.level ? request.parameters.level : 0).then((level) => {
            let user = new User({
                firstname: request.parameters.firstname,
                lastname: request.parameters.lastname,
                username: request.parameters.username,
                email: request.parameters.email,
                password: request.parameters.password,
                phone_number: request.parameters.phone_number,
                tokens: [],
                level: level._id
            });
            user.save((error: any) => {
                if(error) {
                    if(error.code === 11000 || error.code === 11001) {
                        request.error(new Error(ErrorType.USER_ALREADY_EXISTS, error)); return;
                    }
                    request.error(new Error(ErrorType.UNKNOWN, error)); return;
                }
                request.respond(null);
            });
        }).catch((error: Error) => {
            request.error(error);
        });
    }

}