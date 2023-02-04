import { model, Schema, Document } from "mongoose";
import {
  CoinMarketInfo,
  CoinType,
} from "@/interfaces/coin-market-info.interface";

const coinMarketInfoSchema: Schema = new Schema({
  coinType: {
    type: Number,
    enum: CoinType,
    required: true,
  },
  coinPrice: {
    type: Number,
    required: true,
  },
});

const coinMarketInfoModel = model<CoinMarketInfo & Document>(
  "CoinMarketInfo",
  coinMarketInfoSchema
);

export default coinMarketInfoModel;
