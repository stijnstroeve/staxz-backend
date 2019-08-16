import {Middleware} from "../Middleware";
import {Request, Response} from "express";
import {RequestHandlerParams} from "express-serve-static-core";
import {ModuleMethod} from "../../Requests/ModuleMethod";
import {Module} from "../../Modules/Module";
import {RequestType} from "../../Requests/RequestType";
import {ErrorType} from "../../Error/ErrorType";
import {ModuleRequest} from "../../Requests/ModuleRequest";
import {Error} from "../../Error/Error";

export class ParameterMiddleware extends Middleware {
    handle(module: Module, method: ModuleMethod): RequestHandlerParams {
        return (req: Request, res: Response, next: Function) => {
            let goNext = true;
            let missing = method.requiredParameters;
            if(!method.requiredParameters) {next(); return}
            method.requiredParameters.forEach((parameter: string) => {
                let toCheck = method.requestType == RequestType.GET ? req.query[parameter] : req.body[parameter];

                if(toCheck == null) {
                    goNext = false;
                } else {
                    let index: number = missing.indexOf(parameter);
                    missing.splice(index, 1);
                }
            });

            let request: ModuleRequest = req.moduleRequest;
            if(!goNext) {
                request.error(new Error(ErrorType.NOT_ENOUGH_PARAMETERS, undefined, undefined, {name: "missing", extra: missing}), 417);
                return;
            }

            request.parameters = method.requestType == RequestType.GET ? req.query : req.body;
            next();
        }
    }
}