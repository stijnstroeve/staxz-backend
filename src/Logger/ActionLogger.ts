import {Error} from "../Error/Error";

export class ActionLogger {
    static logError(error: Error) {
        console.log(error);
    }
}