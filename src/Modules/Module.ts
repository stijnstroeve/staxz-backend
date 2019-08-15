import {ModuleMethod} from "../Requests/ModuleMethod";
import {UserModule} from "./UserModule";
import {FallbackModule} from "./FallbackModule";

export abstract class Module {

    // static modules: Module[];

    abstract name: string;
    abstract moduleMethods: ModuleMethod[];

    abstract registerModuleMethods(): void;

    // static registerModules() {
    //     let userModule: Module = new UserModule();
    //
    //     userModule.registerModuleRequests();
    //
    //     this.modules.push(userModule);
    // }
    //
    // static getModule(name: string): Module {
    //     let module = this.modules.find((module) => module.name === name);
    //     return module ? module : new FallbackModule();
    // }

}