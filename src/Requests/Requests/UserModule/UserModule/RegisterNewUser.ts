import {ModuleMethod} from "../../../ModuleMethod";
import {RequestType} from "../../../RequestType";
import {ModuleRequest} from "../../../ModuleRequest";
import {ErrorType} from "../../../../Error/ErrorType";
import {Error} from "../../../../Error/Error";
import User, { SimpleUser } from "../../../../Database/UserModule/User";
import PermissionLevel from "../../../../Database/UserModule/PermissionLevel";
import UserInfo, { IUserInfo } from "../../../../Database/UserModule/UserInfo";

export class RegisterNewUser extends ModuleMethod {

    request: string = "registerNewUser";
    requestType: RequestType = RequestType.POST;
    requiredParameters: string[] = ["firstname", "lastname", "username", "email", "password", "phone_number"];
    needsAuth: boolean = false;

    async handle(request: ModuleRequest) {
        let simpleUser: SimpleUser = {
            level: 0,
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