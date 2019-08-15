import {Middleware} from "../Middleware";
import {Request, Response} from "express";
import {RequestHandlerParams} from "express-serve-static-core";
import {ModuleMethod} from "../../Requests/ModuleMethod";
import {Module} from "../../Modules/Module";
import {ModuleRequest} from "../../Requests/ModuleRequest";

export class ModuleRequestMiddleware extends Middleware {
    handle(module: Module, method: ModuleMethod): RequestHandlerParams {
        return (req: Request, res: Response, next: Function) => {
            let request: ModuleRequest = new ModuleRequest(req, res, method);

            req.moduleRequest = request;
            next();
        }
    }
}