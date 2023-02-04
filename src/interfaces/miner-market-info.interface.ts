import { Types } from "mongoose";
import { CoinType } from "./coin-market-info.interface";
import { InventoryItem } from "./inventory-item.interface";

export type MinerMarketInfo = {
  _id: Types.ObjectId;
  coinType: CoinType;
  minerInventoryItem: Types.ObjectId | InventoryItem;
  dailyCoinEarning: number;
};
