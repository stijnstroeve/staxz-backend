import {ModuleRequest} from "../../../ModuleRequest";
import {ModuleMethod} from "../../../ModuleMethod";
import {RequestType} from "../../../RequestType";
import {ErrorType} from "../../../../Error/ErrorType";
import {Error} from "../../../../Error/Error";
import User, { IUser } from "../../../../Database/UserModule/User";
import AddressInfo, { IAddressInfo } from "../../../../Database/UserModule/AddressInfo";
import mongoose = require("mongoose");

export class SetUserAddress extends ModuleMethod {

    request: string = "setUserAddress";
    requestType: RequestType = RequestType.POST;
    requiredParameters: string[] = ["user_id"];
    notRequiredParameters: string[] = ["address1", "address2", "postal_code", "house_number"];
    needsAuth: boolean = true;

    async handle(request: ModuleRequest) {
        User.findOne({_id: request.parameters.user_id}, (error: any, user: IUser) => {
            if(error) {request.error(new Error(ErrorType.USER_NOT_FOUND, error)); return}
            if(!user) {request.error(new Error(ErrorType.USER_NOT_FOUND, error)); return}

            AddressInfo.findOne({_id: user.user_address}, (error: any, address: IAddressInfo) => {
                if(error) {request.error(new Error(ErrorType.UNKNOWN, error)); return}
                
                //If there is no address found, create a new address.
                if(!address) {
                    let addressInfo = new AddressInfo({
                        _id: new mongoose.Types.ObjectId(),
                        address1: request.parameters.address1,
                        address2: request.parameters.address2,
                        postal_code: request.parameters.postal_code,
                        house_number: request.parameters.house_number
                    });
                    addressInfo.save((error: any) => {
                        if(error) {request.error(new Error(ErrorType.UNKNOWN, error)); return}

                        User.updateOne({_id: request.parameters.user_id}, {user_address: addressInfo._id}, (error: any) => {
                            if(error) {request.error(new Error(ErrorType.UNKNOWN, error)); return}

                            request.respond(null);
                        });
                    });
                } else {
                    AddressInfo.updateOne({_id: address._id}, {
                        address1: request.parameters.address1 ? request.parameters.address1 : address.address1,
                        address2: request.parameters.address2 ? request.parameters.address2 : address.address2,
                        postal_code: request.parameters.postal_code ? request.parameters.postal_code : address.postal_code,
                        house_number: request.parameters.house_number ? request.parameters.house_number : address.house_number
                    }, (error: any) => {
                        if(error) {request.error(new Error(ErrorType.UNKNOWN, error)); return}
                        request.respond(null);
                    })
                }

            }); 

        });

    }

}