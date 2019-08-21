import {Middleware} from "../Middleware";
import {Request, Response} from "express";
import {RequestHandlerParams} from "express-serve-static-core";
import {ModuleMethod} from "../../Requests/ModuleMethod";
import {Module} from "../../Modules/Module";
import User from "../../Database/UserModule/User";
import {ErrorType} from "../../Error/ErrorType";
import {Error} from "../../Error/Error";

export class AuthorizationMiddleware extends Middleware {
    handle(module: Module, method: ModuleMethod): RequestHandlerParams {
        return (req: Request, res: Response, next: Function) => {
            if(method.needsAuth) {
                let requestToken = req.token;
                if(requestToken) {
                    User.findByToken(requestToken).then((user: any) => {
                        if(!user.rank.permissions.includes(method.request)) {
                            req.moduleRequest.error(new Error(ErrorType.NO_PERMISSION));
                            return;
                        }
                        req.User = user;
                        next();
                    }).catch((error: any) => {
                        req.moduleRequest.error(error);
                    });
                } else {
                    req.moduleRequest.error(new Error(ErrorType.NOT_AUTHORIZED));
                }
            } else {
                next();
            }
        }
    }
}