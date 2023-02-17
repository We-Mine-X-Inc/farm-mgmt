import { CoinType } from "@/interfaces/coin-market-info.interface";
import { Revenue } from "@/interfaces/performance/revenue.interface";

export function convertPoolMarsDataToRevenue({
  data,
  coinType,
}: {
  data: any;
  coinType: CoinType;
}): Revenue {
  return {
    amount:
      parseFloat(data["paid"]) +
      parseFloat(data["balance"]) +
      parseFloat(data["paid_pps"]) +
      parseFloat(data["balance_pps"]),
    coinType,
  };
}
