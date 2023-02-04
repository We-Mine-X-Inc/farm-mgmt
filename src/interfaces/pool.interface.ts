import { Types } from "mongoose";
import { Customer } from "./customer.interface";
import { Miner } from "./miner.interface";

export enum PoolPurposeType {
  UNKNOWN = 0,
  MINING_FEE = 1,
  PURE_COMPANY_REVENUE = 2,
  CLIENT_REVENUE = 3,
}

export enum PoolType {
  UNKNOWN = 0,
  SLUSH_POOL = 1,
  POOL_MARS = 2,
}

export interface Pool {
  _id: Types.ObjectId;
  creator: Types.ObjectId | Customer;
  protocol: string;
  domain: string;
  username: string;
  poolType: PoolType;
  purpose: PoolPurposeType;
}
