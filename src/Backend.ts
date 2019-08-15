import express = require("express");
import {LogType} from "./Logger/LogType";
import Logger from "./Logger/Logger";
import {Module} from "./Modules/Module";

class Backend {
    port: number;
    application: express.Application;

    constructor(port: number) {
        this.port = port;
        this.application = express();
    }

    start() {
        //Start listening on the given port
        this.application.listen(this.port, () => {
            Logger.logType(LogType.INFO, "Started backend listener on port " + this.port + ".")
        });

        Module.registerModules();
    }

}

export default Backend;