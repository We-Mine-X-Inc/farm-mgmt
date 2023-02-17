import { Types } from "mongoose";
import { CoinType } from "./coin-market-info.interface";
import { InventoryItem } from "./inventory-item.interface";

export type MinerMarketInfo = {
  _id: Types.ObjectId;
  coinType: CoinType;
  minerInventoryItem: InventoryItem;
  dailyCoinEarning: number;
};

export const MINER_MARKET_INFO_FIELDS_TO_POPULATE = [
  {
    path: "minerInventoryItem",
    populate: { path: "operationalDependencies" },
  },
];
