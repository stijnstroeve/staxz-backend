import {ModuleRequest} from "../../../ModuleRequest";
import {RequestType} from "../../../RequestType";
import {ModuleMethod} from "../../../ModuleMethod";
import {Error} from "../../../../Error/Error";
import User from "../../../../Database/UserModule/User";

export class RefreshAccessToken extends ModuleMethod {

    request: string = "refreshToken";
    requestType: RequestType = RequestType.POST;
    requiredParameters: string[] = ["refresh_token"];
    needsAuth: boolean = false;

    handle(request: ModuleRequest) {
        User.refreshToken(request.parameters.refresh_token).then((newToken: any) => {
            request.respond({accessToken: newToken});
        }).catch((error: Error) => {
            request.error(error);
        });
    }

}