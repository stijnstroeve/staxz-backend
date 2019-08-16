import {Module} from "./Module";
import {RegisterNewUser} from "../Requests/Requests/UserModule/RegisterNewUser";
import {ModuleMethod} from "../Requests/ModuleMethod";
import {LogInUser} from "../Requests/Requests/UserModule/LogInUser";
import {RefreshAccessToken} from "../Requests/Requests/UserModule/RefreshAccessToken";

export class UserModule extends Module {
    name: string = "UserModule";
    moduleMethods: ModuleMethod[] = [];

    registerModuleMethods(): void {
        this.moduleMethods.push(new RegisterNewUser());
        this.moduleMethods.push(new LogInUser());
        this.moduleMethods.push(new RefreshAccessToken());
    }

}