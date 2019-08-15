import {ModuleMethod} from "../../ModuleMethod";
import {RequestType} from "../../RequestType";
// import {DefaultResponse} from "../../DefaultResponse";
// import {ErrorType} from "../../../ErrorType";
// import User from "../../../database/models/UserModule/User";
// import {Request, Response} from "express";
import {ModuleRequest} from "../../ModuleRequest";

export class RegisterNewUser extends ModuleMethod {

    request: string = "registerNewUser";
    requestType: RequestType = RequestType.POST;
    // requiredParameters: string[] = ["firstname", "lastname", "username", "email", "password", "phone_number"];
    needsAuth: boolean = false;

    async handle(request: ModuleRequest) {

        request.respond("Success");

        // let user = new User({
        //     firstName: req.body.firstName,
        //     lastName: req.body.lastName,
        //     userName: req.body.userName,
        //     email: req.body.email,
        //     password: req.body.password,
        //     tokens: []
        // });
        //
        // user.save((error: any) => {
        //     if(error) {
        //         if(error.code === 11000 || error.code === 11001) {
        //             res.send(new DefaultResponse(req, false, null, ErrorType.USER_ALREADY_EXISTS.withRef(1)).json()); console.log(error); return;
        //         }
        //         res.send(new DefaultResponse(req, false, null, ErrorType.UNKNOWN.withRef(5)).json()); console.log(error); return;
        //     }
        //     res.send(new DefaultResponse(req, true).json());
        // });
    }

}