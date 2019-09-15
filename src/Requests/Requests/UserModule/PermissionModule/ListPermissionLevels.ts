import PermissionLevel, {IPermissionLevel} from "../../../../Database/UserModule/PermissionLevel";
import {ModuleRequest} from "../../../ModuleRequest";
import {ModuleMethod} from "../../../ModuleMethod";
import {RequestType} from "../../../RequestType";
import {ErrorType} from "../../../../Error/ErrorType";
import {Error} from "../../../../Error/Error";
import {Sort} from "../../../../Sort/Sort";
import {SortType} from "../../../../Sort/SortType";

export class ListPermissionLevels extends ModuleMethod {

    request: string = "listPermissionLevels";
    requestType: RequestType = RequestType.GET;
    needsAuth: boolean = true;

    async handle(request: ModuleRequest) {
        PermissionLevel.find({}, (error, levels) => {
            if(error) {request.error(new Error(ErrorType.UNKNOWN, error));return}
            let levelsToSend: any[] = [];
            levels.forEach((level: IPermissionLevel) => {
                levelsToSend.push({
                    level: level.level,
                    name: level.name,
                    permissions: level.permissions
                });
            });
            request.respond(Sort.sortObject(levelsToSend, "level", SortType.NUMERIC));
        });
    }

}