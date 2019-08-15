import {Request, Response} from "express";
import {ModuleMethod} from "./ModuleMethod";
import {DefaultResponse} from "./DefaultResponse";
import {Error} from "../Error/Error";

export class ModuleRequest {
    private readonly _request: Request;
    private readonly _response: Response;
    private readonly _method: ModuleMethod;

    constructor(request: Request, response: Response, method: ModuleMethod) {
        this._request = request;
        this._response = response;
        this._method = method;
    }

    respond(data: any) {
        this._response.send(new DefaultResponse(this, true).json());
    }

    error(error: Error) {
        this._response.send(new DefaultResponse(this, false, error).json());
    }

    get request(): Request {
        return this._request;
    }

    get response(): Response {
        return this._response;
    }

    get method(): ModuleMethod {
        return this._method;
    }

}