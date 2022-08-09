import { Types } from "mongoose";

export enum PoolPurposeType {
  UNKNOWN,
  MINING_FEE,
  PURE_COMPANY_REVENUE,
  CLIENT_REVENUE,
}

export interface Pool {
  _id: Types.ObjectId;
  minerId: Types.ObjectId;
  url: string;
  username: string;
  purpose: PoolPurposeType;
}
