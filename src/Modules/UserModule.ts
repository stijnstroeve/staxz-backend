import {Module} from "./Module";
import {RegisterNewUser} from "../Requests/Requests/UserModule/UserModule/RegisterNewUser";
import {ModuleMethod} from "../Requests/ModuleMethod";
import {LogInUser} from "../Requests/Requests/UserModule/UserModule/LogInUser";
import {RefreshAccessToken} from "../Requests/Requests/UserModule/UserModule/RefreshAccessToken";
import {Test} from "../Requests/Requests/UserModule/Test";
import {ListPermissionLevels} from "../Requests/Requests/UserModule/PermissionModule/ListPermissionLevels";
import {SetUserPermissionLevel} from "../Requests/Requests/UserModule/PermissionModule/SetUserPermissionLevel";
import {CreateNewUser} from "../Requests/Requests/UserModule/UserModule/CreateNewUser";
import { SetUserAddress } from "../Requests/Requests/UserModule/InfoModule/SetUserAddress";

export class UserModule extends Module {
    name: string = "UserModule";
    moduleMethods: ModuleMethod[] = [];

    registerModuleMethods(): void {
        this.moduleMethods.push(new RegisterNewUser());
        this.moduleMethods.push(new CreateNewUser());
        this.moduleMethods.push(new LogInUser());
        this.moduleMethods.push(new RefreshAccessToken());
        this.moduleMethods.push(new Test());

        //PermissionModule
        this.moduleMethods.push(new ListPermissionLevels());
        this.moduleMethods.push(new SetUserPermissionLevel());

        //InfoModule
        this.moduleMethods.push(new SetUserAddress());
    }

}