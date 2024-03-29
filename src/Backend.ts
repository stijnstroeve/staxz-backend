import express = require("express");
import bearerTokens = require("express-bearer-token");
import * as bodyParser from "body-parser";
import config from "../config/config.json";
import {LogType} from "./Logger/LogType";
import Logger from "./Logger/Logger";
import {ModuleHandler} from "./Modules/ModuleHandler";
import {Router} from "./Routers/Router";
import Mongo from "./Database/Mongo";
import { ActionLogger } from "./Logger/ActionLogger.js";

class Backend {
    static instance: Backend;
    port: number;
    application: express.Application;

    constructor(port: number) {
        this.port = port;
        this.application = express();
    }

    start() {
        //Setup the action logger.
        ActionLogger.setup();

        this.register();

        Mongo.connect();
    }

    startListener() {
        //Start listening on the given port
        this.application.listen(this.port, () => {
            Logger.logType(LogType.INFO, "Started backend listener on port " + this.port + ".")
        })
    }

    register() {
        //Register all modules
        ModuleHandler.registerModules();

        //Register middleware
        this.registerMiddleware();

        //Register routes and and them to them application router
        Router.registerRoutes();
    }

    registerMiddleware() {
        this.application.use(bodyParser.urlencoded({extended: false}));
        this.application.use(bodyParser.json());
        this.application.use(bearerTokens());
        this.application.use(config.ROUTER_PREFIX, Router.router);
    }
    static createInstance(port: number) {
        this.instance = new Backend(port);
    }
    static getInstance() {
        return this.instance;
    }
}

export default Backend;