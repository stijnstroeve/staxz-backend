import {Error} from "../Error/Error";
import {ModuleRequest} from "../Requests/ModuleRequest";

export class ActionLogger {
    static logError(error: Error) {
        console.log(error);
    }
    static logRequest(request: ModuleRequest) {
        // console.log(request);
    }
}