import express = require("express");
import {Request} from "express";
import {ModuleHandler} from "../Modules/ModuleHandler";
import {RequestType} from "../Requests/RequestType";
import {MiddlewareHandler} from "../Middleware/MiddlewareHandler";

export class Router {
    static router = express.Router();

    static registerRoutes() {
        for(let i = 0; i < ModuleHandler.modules.length; i++) {
            let module = ModuleHandler.modules[i];

            for(let x = 0; x < module.moduleMethods.length; x++) {
                let method =  module.moduleMethods[x];
                let prefix = "/" + module.name + "/" + method.request;

                if(method.requestType === RequestType.GET) { this.router.get(prefix, MiddlewareHandler.middleware(method, module), (req: Request) => method.handle(req.moduleRequest)); }
                if(method.requestType === RequestType.POST) { this.router.post(prefix, MiddlewareHandler.middleware(method, module), (req: Request) => method.handle(req.moduleRequest)); }
                if(method.requestType === RequestType.OPTIONS) { this.router.options(prefix, MiddlewareHandler.middleware(method, module), (req: Request) => method.handle(req.moduleRequest)); }
                if(method.requestType === RequestType.PUT) { this.router.put(prefix, MiddlewareHandler.middleware(method, module), (req: Request) => method.handle(req.moduleRequest)); }
                if(method.requestType === RequestType.DELETE) { this.router.delete(prefix, MiddlewareHandler.middleware(method, module), (req: Request) => method.handle(req.moduleRequest)); }

            }
        }
    }

}