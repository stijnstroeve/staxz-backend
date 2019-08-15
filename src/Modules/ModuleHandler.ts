import {Module} from "./Module";
import {UserModule} from "./UserModule";
import {FallbackModule} from "./FallbackModule";

export class ModuleHandler {

    static modules: Module[] = [];

    static registerModules() {
        let userModule: Module = new UserModule();

        userModule.registerModuleMethods();

        this.modules.push(userModule);
    }

    static getModule(name: string): Module {
        let module = this.modules.find((module) => module.name === name);
        return module ? module : new FallbackModule();
    }
}
