import { Pool, PoolType } from "@/interfaces/pool.interface";
import axios from "axios";
import { getApiHeaders, POOL_METRICS_API_DOMAIN } from "../common";
import { convertPoolMarsWorkerHashRates } from "./pool-mars-hashrate";
import { convertSlushPoolWorkerHashRates } from "./slush-pool-hashrate";

export async function fetchWorkerHashRateContributionsData(pool: Pool) {
  const endpoint = constructWorkerHashRateEndpoint(pool);
  return await axios({
    headers: getApiHeaders(pool),
    method: "get",
    url: endpoint,
  }).then((res) => {
    return convertPoolHashRateData({ pool, data: res.data });
  });
}

function constructWorkerHashRateEndpoint(pool: Pool) {
  const domain = POOL_METRICS_API_DOMAIN[pool.poolType];
  switch (pool.poolType) {
    case PoolType.POOL_MARS:
      return `${domain}/api/miner/${pool.username}/workers`;
    case PoolType.SLUSH_POOL:
      return `${domain}/accounts/workers/json/btc`;
    default:
      return undefined;
  }
}

function convertPoolHashRateData({ pool, data }: { pool: Pool; data: any }) {
  switch (pool.poolType) {
    case PoolType.POOL_MARS:
      return convertPoolMarsWorkerHashRates(data);
    case PoolType.SLUSH_POOL:
      return convertSlushPoolWorkerHashRates(data);
    default:
      return null;
  }
}
