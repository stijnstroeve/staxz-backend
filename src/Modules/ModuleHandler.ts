import {Module} from "./Module";
import {UserModule} from "./UserModule";
import {FallbackModule} from "./FallbackModule";
import {RewardModule} from "./RewardModule";
import { PointsModule } from "./PointsModule";

export class ModuleHandler {

    static modules: Module[] = [];

    static registerModules() {
        let modules = [
            new UserModule(),
            new RewardModule(),
            new PointsModule()
        ];

        modules.forEach((module) => {
            module.registerModuleMethods();

            this.modules.push(module);
        });
    }

    static getModule(name: string): Module {
        let module = this.modules.find((module) => module.name === name);
        return module ? module : new FallbackModule();
    }
}
