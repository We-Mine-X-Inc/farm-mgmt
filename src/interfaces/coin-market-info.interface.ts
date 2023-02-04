import { Types } from "mongoose";

export enum CoinType {
  UNKNOWN = 0,
  KDA = 1,
  BTC = 2,
}

export type CoinMarketInfo = {
  _id: Types.ObjectId;
  coinType: CoinType;
  coinPrice: number;
};
