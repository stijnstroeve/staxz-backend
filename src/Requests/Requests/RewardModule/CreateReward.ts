import {ModuleMethod} from "../../ModuleMethod";
import {RequestType} from "../../RequestType";
import {ModuleRequest} from "../../ModuleRequest";
import Reward, {IReward} from "../../../Database/RewardModule/Reward";
import {Error} from "../../../Error/Error";

export class CreateReward extends ModuleMethod {

    request: string = "createReward";
    requestType: RequestType = RequestType.POST;
    requiredParameters: string[] = ["name", "description"];
    needsAuth: boolean = true;

    async handle(request: ModuleRequest) {
        Reward.createReward(request.parameters.name, request.parameters.description).then((reward: IReward) => {
            request.respond(reward);
        }).catch((error: Error) => {
            request.error(error);
        });
    }

}