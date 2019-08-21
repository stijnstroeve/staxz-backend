import Rank from "../../../../Database/UserModule/Rank";
import {ModuleRequest} from "../../../ModuleRequest";
import {ModuleMethod} from "../../../ModuleMethod";
import {RequestType} from "../../../RequestType";
import {ErrorType} from "../../../../Error/ErrorType";
import {Error} from "../../../../Error/Error";
import User from "../../../../Database/UserModule/User";

export class SetUserRank extends ModuleMethod {

    request: string = "setUserRank";
    requestType: RequestType = RequestType.POST;
    requiredParameters: string[] = ["user_id", "rank"];
    needsAuth: boolean = false;

    async handle(request: ModuleRequest) {
        User.findOne({_id: request.parameters.user_id}, (error: any, user: any) => {
            if(error) {request.error(new Error(ErrorType.USER_NOT_FOUND, error)); return}

            Rank.findOne({level: request.parameters.rank}, (error, rank: any) => {
                if(error) {request.error(new Error(ErrorType.RANK_NOT_FOUND, error, [{name: "LEVEL", variable: request.parameters.rank}]));return}

                User.updateOne({_id: request.parameters.user_id}, {rank: rank._id}, (error, rank: any) => {
                    if(error) {request.error(new Error(ErrorType.UNKNOWN, error)); return}

                    request.respond(null);
                });

            });
        });

    }

}