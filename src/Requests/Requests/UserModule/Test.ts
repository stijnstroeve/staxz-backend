import {ModuleMethod} from "../../ModuleMethod";
import {RequestType} from "../../RequestType";
import {ModuleRequest} from "../../ModuleRequest";
import {ErrorType} from "../../../Error/ErrorType";
import {Error} from "../../../Error/Error";
import User, {IUser} from "../../../Database/UserModule/User";

export class Test extends ModuleMethod {

    request: string = "test";
    requestType: RequestType = RequestType.GET;
    needsAuth: boolean = false;

    async handle(request: ModuleRequest) {
        // let user = new User({
        //     firstname: request.parameters.firstname,
        //     lastname: request.parameters.lastname,
        //     username: request.parameters.username,
        //     email: request.parameters.email,
        //     password: request.parameters.password,
        //     phone_number: request.parameters.phone_number,
        //     tokens: []
        // });

        User.findOne({email: "stijnstroeve3@hotmail.com"})
            .populate('rank')
            .exec(function (err, user: IUser) {
                if (err) console.log(err);
                request.respond(user);
                console.log(user.rank.level);
                // prints "The author is Ian Fleming"
            });

        // user.save((error: any) => {
        //     if(error) {
        //         if(error.code === 11000 || error.code === 11001) {
        //             request.error(new Error(ErrorType.USER_ALREADY_EXISTS, error)); return;
        //         }
        //         request.error(new Error(ErrorType.UNKNOWN, error)); return;
        //     }
        //     request.respond(null);
        // });
    }

}