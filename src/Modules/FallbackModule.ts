import {Module} from "./Module";
import {ModuleMethod} from "../Requests/ModuleMethod";

export class FallbackModule extends Module {
    name: string = "FallbackModule";
    moduleRequests: ModuleMethod[] = [];

    registerModuleRequests(): void {}

}