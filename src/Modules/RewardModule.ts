import {Module} from "./Module";
import {ModuleMethod} from "../Requests/ModuleMethod";
import {ListRewards} from "../Requests/Requests/RewardModule/ListRewards";
import {CreateReward} from "../Requests/Requests/RewardModule/CreateReward";

export class RewardModule extends Module {
    name: string = "RewardModule";
    moduleMethods: ModuleMethod[] = [];

    registerModuleMethods(): void {
        this.moduleMethods.push(new ListRewards());
        this.moduleMethods.push(new CreateReward());
    }

}