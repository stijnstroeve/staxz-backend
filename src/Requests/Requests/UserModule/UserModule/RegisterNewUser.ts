import {ModuleMethod} from "../../../ModuleMethod";
import {RequestType} from "../../../RequestType";
import {ModuleRequest} from "../../../ModuleRequest";
import {ErrorType} from "../../../../Error/ErrorType";
import {Error} from "../../../../Error/Error";
import User from "../../../../Database/UserModule/User";
import Rank, {IRank} from "../../../../Database/UserModule/Rank";

export class RegisterNewUser extends ModuleMethod {

    request: string = "registerNewUser";
    requestType: RequestType = RequestType.POST;
    requiredParameters: string[] = ["firstname", "lastname", "username", "email", "password", "phone_number"];
    needsAuth: boolean = false;

    async handle(request: ModuleRequest) {
        Rank.findOne({level: 0}, (error, rank: IRank) => {
            if(error) {request.error(new Error(ErrorType.UNKNOWN, error)); return;}

            let user = new User({
                firstname: request.parameters.firstname,
                lastname: request.parameters.lastname,
                username: request.parameters.username,
                email: request.parameters.email,
                password: request.parameters.password,
                phone_number: request.parameters.phone_number,
                tokens: [],
                rank: rank._id
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

        });

    }

}