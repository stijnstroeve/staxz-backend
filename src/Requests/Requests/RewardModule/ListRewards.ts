import {ModuleMethod} from "../../ModuleMethod";
import {RequestType} from "../../RequestType";
import {ModuleRequest} from "../../ModuleRequest";
import Reward, {IReward} from "../../../Database/RewardModule/Reward";
import {Error} from "../../../Error/Error";

export class ListRewards extends ModuleMethod {

    request: string = "listRewards";
    requestType: RequestType = RequestType.GET;
    needsAuth: boolean = true;

    async handle(request: ModuleRequest) {
        Reward.listRewards().then((rewards: IReward[]) => {
            request.respond(rewards);
        }).catch((error: Error) => {
            request.error(error);
        });
    }

}