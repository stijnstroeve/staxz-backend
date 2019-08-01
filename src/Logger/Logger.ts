
import {Color} from "./Color";
import {LogType} from "./LogType";
import config from "../../config/config.json";

export default class Logger {

    static log(message: string, color: Color = Color.WHITE) {
        console.log('[' + this.getCurrentTime() + '] ' + color + message + Color.RESET);
    }
    static logType(type: LogType, message: string) {
        if(type === LogType.DEBUG && config.STAGE != 'development') return;
        console.log('[' + this.getCurrentTime() + '] ' + type + message + Color.RESET);
    }
    static getCurrentTime() {
        let date = new Date();
        return date.toLocaleTimeString();
    }

}