import {Error} from "../Error/Error";
import {ModuleRequest} from "../Requests/ModuleRequest";
import config from "../../config/config.json";
import fs = require("fs");
import path = require("path");
import Logger from "./Logger";
import { LogType } from "./LogType";
import { ModuleMethod } from "../Requests/ModuleMethod";
import { Utils } from "../Utils/Utils";

class LogRequest {
    private readonly request: any;
    private readonly user: any;
    private readonly ip: string;
    private readonly response: any;

    constructor(request: ModuleRequest, response: any) {
        this.request = {
            module: request.request.moduleName,
            method: request.method.request,
            body: request.request.body,
            query: request.request.query
        };
        this.user = request.request.User ? Utils.fastClone(request.request.User) : undefined;
        if(this.user) {
            this.user.user_info = this.user.user_info._id ? this.user.user_info._id : this.user.user_info;
            this.user.level = this.user.level._id ? this.user.level._id : this.user.level;
            this.user.tokens = undefined; //Remove tokens so it won't take up to much data
            if(this.user.address_info) this.user.address_info = this.user.address_info._id ? this.user.address_info._id : this.user.address_info;
        }
        this.ip = request.request.ip;
        this.response = response;
    }
}

export class ActionLogger {
    static setup() {
        if (!fs.existsSync(path.join(config.OUTPUT_PATH))){
            fs.mkdirSync(path.join(config.OUTPUT_PATH));
        }
    }
    static logError(error: Error) {
        let date = Utils.currentDate(); //TODO Dont calculate the current date every time the logger needs to log something.
        let fileName = "errors-" + date + ".txt";

        fs.appendFile(path.join(config.OUTPUT_PATH, fileName), JSON.stringify(error) + "\n", 'utf8', (error) => {
            if(error) {
                Logger.logType(LogType.ERROR, "Error writing to " + fileName + "!"); 
                return;
            };
        });
    }
    static logRequest(request: ModuleRequest, response: any) {
        let clone = Utils.fastClone(response);
        clone.data = undefined; //Remove data so not too much of the request gets logged.
        let date = Utils.currentDate(); //TODO Dont calculate the current date every time the logger needs to log something.
        let fileName = "requests-" + date + ".txt";

        let logRequest: LogRequest = new LogRequest(request, clone);
        fs.appendFile(path.join(config.OUTPUT_PATH, fileName), JSON.stringify(logRequest) + "\n", 'utf8', (error) => {
            if(error) {
                Logger.logType(LogType.ERROR, "Error writing to " + fileName + "!"); 
                return;
            };
        });
    }
    static logAction(actionName: string, actionData: any) {

    }
}