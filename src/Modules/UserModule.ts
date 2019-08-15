import {Module} from "./Module";
import {RegisterNewUser} from "../Requests/Requests/UserModule/RegisterNewUser";
import {ModuleMethod} from "../Requests/ModuleMethod";

export class UserModule extends Module {
    name: string = "UserModule";
    moduleMethods: ModuleMethod[] = [];

    registerModuleMethods(): void {
        this.moduleMethods.push(new RegisterNewUser());
    }

}