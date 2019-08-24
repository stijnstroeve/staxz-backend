import {Module} from "./Module";
import {UserModule} from "./UserModule";
import {FallbackModule} from "./FallbackModule";
import {RewardModule} from "./RewardModule";

export class ModuleHandler {

    static modules: Module[] = [];

    static registerModules() {
        let userModule: Module = new UserModule();
        let rewardModule: Module = new RewardModule();

        userModule.registerModuleMethods();
        rewardModule.registerModuleMethods();

        this.modules.push(userModule);
        this.modules.push(rewardModule);
    }

    static getModule(name: string): Module {
        let module = this.modules.find((module) => module.name === name);
        return module ? module : new FallbackModule();
    }
}
