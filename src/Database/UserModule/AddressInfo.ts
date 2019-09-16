import * as mongoose from "mongoose";

export interface IAddressInfo extends mongoose.Document {
    address1: string,
    address2: string,
    postal_code: string,
    house_number: string,
    date_updated: Date,
    date_created: Date
}

export const AddressInfoSchema = new mongoose.Schema({
    address1: {type: String, required: false},
    address2: {type: String, required: false},
    postal_code: {type: String, required: false},
    house_number: {type: String, required: false},
    date_updated: {type: Date, default: Date.now},
    date_created: {type: Date, default: Date.now}
});

AddressInfoSchema.pre<IAddressInfo>('save', function(next) {
    this.date_updated = new Date(Date.now());
    next();
});

const AddressInfo = mongoose.model<IAddressInfo>("AddressInfo", AddressInfoSchema);

export default AddressInfo;