import { CoinType } from "@/interfaces/coin-market-info.interface";
import { Revenue } from "@/interfaces/performance/revenue.interface";

export function convertSlushPoolDataToRevenue({
  data,
  coinType,
}: {
  data: any;
  coinType: CoinType;
}): Revenue {
  console.log("convertSlushPoolDataToRevenue");
  console.log("data");
  console.log(data);
  const btcInfo = data["btc"];
  return {
    amount:
      parseFloat(btcInfo["confirmed_reward"]) +
      parseFloat(btcInfo["unconfirmed_reward"]),
    coinType,
  };
}
