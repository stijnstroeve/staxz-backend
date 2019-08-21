import Rank, {IRank} from "../../../../Database/UserModule/Rank";
import {ModuleRequest} from "../../../ModuleRequest";
import {ModuleMethod} from "../../../ModuleMethod";
import {RequestType} from "../../../RequestType";
import {ErrorType} from "../../../../Error/ErrorType";
import {Error} from "../../../../Error/Error";
import {Sort} from "../../../../Sort/Sort";
import {SortType} from "../../../../Sort/SortType";

export class ListRanks extends ModuleMethod {

    request: string = "listRanks";
    requestType: RequestType = RequestType.GET;
    needsAuth: boolean = true;

    async handle(request: ModuleRequest) {
        Rank.find({}, (error, ranks) => {
            if(error) {request.error(new Error(ErrorType.UNKNOWN, error));return}
            let ranksToSend: any[] = [];
            ranks.forEach((rank: IRank) => {
                ranksToSend.push({
                    level: rank.level,
                    name: rank.name,
                    permissions: rank.permissions
                });
            });
            request.respond(Sort.sortObject(ranksToSend, "level", SortType.NUMERIC));
        });
    }

}