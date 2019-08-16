import {Middleware} from "../Middleware";
import {Request, Response} from "express";
import {RequestHandlerParams} from "express-serve-static-core";
import {ModuleMethod} from "../../Requests/ModuleMethod";
import {Module} from "../../Modules/Module";
import {LogType} from "../../Logger/LogType";
import Logger from "../../Logger/Logger";

export class LogMiddleware extends Middleware {
    handle(module: Module,  method: ModuleMethod): RequestHandlerParams {
        return (req: Request, res: Response, next: Function) => {
            Logger.logType(LogType.DEBUG, "A request was made on the module " + module.name + " and the request was " + method.request + "!");
            next();
        }
    }
}