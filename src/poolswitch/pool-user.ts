import { PoolType } from "@/interfaces/pool.interface";
import { SwitchPoolParams, VerifyOperationsParams } from "./common-types";
import { getPoolWorker } from "./pool-workers";

export function constructPoolUser(
  params: SwitchPoolParams | VerifyOperationsParams
) {
  return `${params.pool.username}${getPoolPaymentMethod(
    params
  )}.${getPoolWorker(params)}`;
}

function getPoolPaymentMethod(
  switchPoolInfo: SwitchPoolParams | VerifyOperationsParams
) {
  switch (switchPoolInfo.pool.poolType) {
    case PoolType.POOL_MARS:
      return "+pps";
    case PoolType.SLUSH_POOL:
      return "";
    default:
      return "";
  }
}
