import config from "../../config/config.json";
import Logger from "../Logger/Logger";
import {LogType} from "../Logger/LogType";
import {ActionLogger} from "../Logger/ActionLogger";
import mongodb = require("mongoose");
import Backend from "../Backend";

export default class Mongo {
    static mongoose = mongodb;
    private static trying: boolean = false;
    private static tries: number = 0;

    static connect() {
        this.tryConnect();
        this.trying = true;

        this.mongoose.set('useCreateIndex', true);
        let db = this.mongoose.connection;

        db.on('connected', () => {this.trying = false;Backend.getInstance().startListener();Logger.logType(LogType.SUCCESS, "MongoDB connection has been established.")});
    }

    private static tryConnect() {
        this.mongoose.connect(config.DATABASE.MONGODB_CONNECTION_URI, {useNewUrlParser: true}, (error) => {
            if(this.trying) {
                ActionLogger.logAction("MONGO_CONNETION_ERROR", error);

                if(!(this.tries < config.DATABASE.RETRY_ROUNDS - 1)) {
                    Logger.logType(LogType.ERROR, "Error connecting to MongoDB. Exiting process...");
                    process.exit();
                    return;
                }

                Logger.logType(LogType.ERROR, "Error connecting to MongoDB. Retrying in 5 seconds... (" + ( config.DATABASE.RETRY_ROUNDS - 1 - this.tries) + " tries left)");
                this.tries++;

                setTimeout(() => this.tryConnect(), 5000);
            }
        });
    }

}