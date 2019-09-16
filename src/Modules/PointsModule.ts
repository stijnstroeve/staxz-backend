import {Module} from "./Module";
import {ModuleMethod} from "../Requests/ModuleMethod";
import { ChangePoints } from "../Requests/Requests/PointsModule/ChangePoints";

export class PointsModule extends Module {
    name: string = "PointsModule";
    moduleMethods: ModuleMethod[] = [];

    registerModuleMethods(): void {
        this.moduleMethods.push(new ChangePoints());
    }

}