import { Types } from "mongoose";

export interface Customer {
  _id: Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  iscompanyCustomer: boolean;
}
