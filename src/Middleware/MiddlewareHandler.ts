import {Module} from "../Modules/Module";
import {RequestHandlerParams} from "express-serve-static-core";
import compose = require("compose-middleware");
import {ParameterMiddleware} from "./Middleware/ParameterMiddleware";
import {ModuleMethod} from "../Requests/ModuleMethod";
import {ModuleRequestMiddleware} from "./Middleware/ModuleRequestMiddleware";
import {LogMiddleware} from "./Middleware/LogMiddleware";

export class MiddlewareHandler {
    static middleware(method: ModuleMethod, module: Module): RequestHandlerParams {

        let middlewareList = [
            new ModuleRequestMiddleware(),
            new LogMiddleware(),
            new ParameterMiddleware(),
            // new AuthorizationMiddleware()
        ];

        //Create a list of middleware to add to the request
        let handleList: RequestHandlerParams[] = [];
        middlewareList.forEach((item) => {
            handleList.push(item.handle(module, method));
        });

        return compose.compose(handleList);
    }
}