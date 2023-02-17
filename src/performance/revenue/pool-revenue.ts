import { Pool, PoolType } from "@/interfaces/pool.interface";
import axios from "axios";
import { getApiHeaders, POOL_METRICS_API_DOMAIN } from "../common";
import { convertPoolMarsDataToRevenue } from "./pool-mars-revenue";
import { convertSlushPoolDataToRevenue } from "./slush-pool-revenue";

export async function fetchRevenueData(pool: Pool) {
  const endpoint = await constructRevenueEndpoint(pool);
  return await axios({
    headers: getApiHeaders(pool),
    method: "get",
    url: endpoint,
  }).then((res) => {
    console.log("fetchRevenueData");
    console.log(res.data);
    return convertPoolRevenueData({ pool, data: res.data });
  });
}

function constructRevenueEndpoint(pool: Pool) {
  const domain = POOL_METRICS_API_DOMAIN[pool.poolType];
  switch (pool.poolType) {
    case PoolType.POOL_MARS:
      return `${domain}/api/miner/${pool.username}`;
    case PoolType.SLUSH_POOL:
      return `${domain}/accounts/profile/json/btc`;
    default:
      return undefined;
  }
}

function convertPoolRevenueData({ pool, data }: { pool: Pool; data: any }) {
  switch (pool.poolType) {
    case PoolType.POOL_MARS:
      return convertPoolMarsDataToRevenue({ data, coinType: pool.coinType });
    case PoolType.SLUSH_POOL:
      return convertSlushPoolDataToRevenue({ data, coinType: pool.coinType });
    default:
      return null;
  }
}
