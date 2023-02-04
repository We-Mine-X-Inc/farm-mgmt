import { model, Schema, Document } from "mongoose";
import { Customer } from "@/interfaces/customer.interface";

const accountSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  isCompanyCustomer: {
    type: Boolean,
    required: true,
  },
});

const accountModel = model<Customer & Document>("Customer", accountSchema);

export default accountModel;
