import { Types } from "mongoose";

export interface User {
  _id: Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  isCompanyUser: boolean;
}
