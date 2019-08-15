import {RequestHandlerParams} from "express-serve-static-core";
import {ModuleMethod} from "../Requests/ModuleMethod";
import {Module} from "../Modules/Module";

export abstract class Middleware {
    abstract handle(module: Module, method: ModuleMethod): RequestHandlerParams;
}