import {Middleware} from "../Middleware";
import {Request, Response} from "express";
import {RequestHandlerParams} from "express-serve-static-core";
import {ModuleMethod} from "../../Requests/ModuleMethod";
import {Module} from "../../Modules/Module";
import {RequestType} from "../../Requests/RequestType";
import {ErrorType} from "../../Error/ErrorType";
import {ModuleRequest} from "../../Requests/ModuleRequest";
import {Error} from "../../Error/Error";
import { Utils } from "../../Utils/Utils";

export class ParameterMiddleware extends Middleware {
    handle(module: Module, method: ModuleMethod): RequestHandlerParams {
        return (req: Request, res: Response, next: Function) => {
            //Set the parameters of the request.
            let request: ModuleRequest = req.moduleRequest;
            request.parameters = method.requestType == RequestType.GET ? req.query : req.body;

            let goNext = true;
            if(!method.requiredParameters) {next(); return}

            //Create a clone so the original "requiredParameters" wont be changed.
            let missing = Utils.fastClone(method.requiredParameters);

            //Check if all required parameters were given.
            for(let i = 0; i < method.requiredParameters.length; i++) {
                let required = method.requiredParameters[i];
    
                if(!(required in request.parameters)) {
                    goNext = false;
                } else {
                    if(request.parameters[required].trim() == "") {
                        goNext = false;
                        continue;
                    }
                    let index = missing.indexOf(required);
                    missing.splice(index, 1);
                }
            }

            if(!goNext) {
                request.error(new Error(ErrorType.NOT_ENOUGH_PARAMETERS, undefined, undefined, {name: "missing", extra: missing}), 417);
                return;
            }

            next();
        }
    }
}