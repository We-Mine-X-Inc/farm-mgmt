import { CoinType } from "@/interfaces/coin-market-info.interface";

export const RevenueSchema = {
  amount: { type: Number },
  coinType: { type: Number, enum: CoinType },
};
