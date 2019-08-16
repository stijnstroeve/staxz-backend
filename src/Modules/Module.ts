import {ModuleMethod} from "../Requests/ModuleMethod";

export abstract class Module {

    abstract name: string;
    abstract moduleMethods: ModuleMethod[];

    abstract registerModuleMethods(): void;

}