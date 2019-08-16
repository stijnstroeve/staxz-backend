import {ModuleMethod} from "../Requests/ModuleMethod";
import {UserModule} from "./UserModule";
import {FallbackModule} from "./FallbackModule";

export abstract class Module {

    abstract name: string;
    abstract moduleMethods: ModuleMethod[];

    abstract registerModuleMethods(): void;

}