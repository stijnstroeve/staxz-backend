import {Module} from "./Module";
import {ModuleMethod} from "../Requests/ModuleMethod";

export class FallbackModule extends Module {
    name: string = "FallbackModule";
    moduleMethods: ModuleMethod[] = [];

    registerModuleMethods(): void {}

}