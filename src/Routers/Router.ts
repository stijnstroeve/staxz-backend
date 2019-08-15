import express = require("express");
import {Router as ExpressRouter} from "express";
import {Module} from "../Modules/Module";

export class Router {
    router = express.Router();

    registerRoutes() {
        for(let i = 0; i < Module.modules.length; i++) {
            let module = Module.modules[i];

            for(let x = 0; x < module.moduleRequests.length; x++) {
                let request =  module.moduleRequests[x];

                this.router.get("/" + request.request);
            }
        }
    }

    private static instance: Router;
    public static getInstance() {
        if(!this.instance) this.instance = new Router();

        return this.instance;
    }
}