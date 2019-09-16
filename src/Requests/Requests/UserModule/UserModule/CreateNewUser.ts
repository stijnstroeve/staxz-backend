import {ModuleRequest} from "../../../ModuleRequest";
import {RequestType} from "../../../RequestType";
import {ModuleMethod} from "../../../ModuleMethod";
import {Error} from "../../../../Error/Error";
import User, { SimpleUser } from "../../../../Database/UserModule/User";
import PermissionLevel, {IPermissionLevel} from "../../../../Database/UserModule/PermissionLevel";
import {ErrorType} from "../../../../Error/ErrorType";
import UserInfo, { IUserInfo } from "../../../../Database/UserModule/UserInfo";

export class CreateNewUser extends ModuleMethod {

    request: string = "createNewUser";
    requestType: RequestType = RequestType.POST;
    requiredParameters: string[] = ["firstname", "lastname", "username", "email", "password", "phone_number"];
    notRequiredParameters: string[] = ["level"];
    needsAuth: boolean = true;

    handle(request: ModuleRequest) {
        let simpleUser: SimpleUser = {
            level: request.parameters.level,
            firstname: request.parameters.firstname,
            lastname: request.parameters.lastname,
            username: request.parameters.username,
            email: request.parameters.email,
            password: request.parameters.password,
            phone_number: request.parameters.phone_number,
            current_ip: request.request.ip
        }

        User.createUser(simpleUser).then(() => {
            request.respond(null);
        }).catch((error: Error) => {
            request.error(error);
        });
    }

}