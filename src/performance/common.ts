import { Pool, PoolType } from "@/interfaces/pool.interface";

export const POOL_METRICS_API_DOMAIN = {
  [PoolType.UNKNOWN]: "",
  [PoolType.SLUSH_POOL]: "https://pool.braiins.com",
  [PoolType.POOL_MARS]: "https://poolmars.net",
};

export function getApiHeaders(pool: Pool) {
  switch (pool.poolType) {
    case PoolType.POOL_MARS:
      return { Accept: "application/json" };
    case PoolType.SLUSH_POOL:
      return {
        Accept: "application/json",
        "SlushPool-Auth-Token": pool.apiToken,
      };
    default:
      return {
        Accept: "application/json",
      };
  }
}
