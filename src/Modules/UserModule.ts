import {Module} from "./Module";
import {RegisterNewUser} from "../Requests/Requests/UserModule/RegisterNewUser";
import {ModuleMethod} from "../Requests/ModuleMethod";

export class UserModule extends Module {
    name: string = "UserModule";
    moduleRequests: ModuleMethod[] = [];

    registerModuleRequests(): void {
        this.moduleRequests.push(new RegisterNewUser());
    }

}