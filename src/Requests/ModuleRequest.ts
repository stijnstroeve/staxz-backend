import {Request, Response} from "express";
import {ModuleMethod} from "./ModuleMethod";
import {DefaultResponse} from "./DefaultResponse";
import {Error} from "../Error/Error";
import {ActionLogger} from "../Logger/ActionLogger";
import { ErrorType } from "../Error/ErrorType";

export class ModuleRequest {
    private readonly _request: Request;
    private readonly _response: Response;
    private readonly _method: ModuleMethod;
    private _parameters?: any;

    constructor(request: Request, response: Response, method: ModuleMethod) {
        this._request = request;
        this._response = response;
        this._method = method;
    }

    respond(data: any) {
        ActionLogger.logRequest(this);

        this._response.send(new DefaultResponse(this, true, data).json());
    }

    error(error: Error, status?: number) {
        if(!(error instanceof Error)) {
            error = new Error(ErrorType.UNKNOWN, error);
        }
        ActionLogger.logRequest(this);

        if(status) {
            this._response.status(status).send(new DefaultResponse(this, false, null, error).json());
        } else {
            this._response.send(new DefaultResponse(this, false, null, error).json());
        }
    }

    get request(): Request {
        return this._request;
    }

    get method(): ModuleMethod {
        return this._method;
    }

    get parameters(): any {
        return this._parameters;
    }

    set parameters(value: any) {
        this._parameters = value;
    }

}