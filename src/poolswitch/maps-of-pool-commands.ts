import { PoolType } from "@/interfaces/pool.interface";
import { fetchWorkerHashRateContributionsData } from "@/performance/hashrate/pool-hashrate";
import { VerifyOperationsParams } from "./common-types";
import { format as prettyFormat } from "pretty-format";

export const HASHRATE_VERIFICATION_FUNCTION: Record<
  PoolType,
  (pool: VerifyOperationsParams) => Promise<any>
> = {
  [PoolType.UNKNOWN]: verifyUnknownPool,
  [PoolType.POOL_MARS]: verifyPoolHashRate,
  [PoolType.SLUSH_POOL]: verifyPoolHashRate,
};

async function verifyPoolHashRate(params: VerifyOperationsParams) {
  const workerContributions = await fetchWorkerHashRateContributionsData(
    params.pool
  );
  const allWorkers = {
    ...workerContributions.clientWorkers,
    ...workerContributions.companyWorkers,
  };
  console.log("workerContributions");
  console.log(prettyFormat(workerContributions));
  const expectedWorkerContribution = Object.entries(allWorkers).find(
    ([workerName, hashRate]) => {
      return (
        workerName.includes(params.miner.friendlyMinerId) &&
        hashRate.quantity > 0
      );
    }
  );
  return expectedWorkerContribution.length > 0;
}

async function verifyUnknownPool(unusedParams: VerifyOperationsParams) {
  throw Error("Unkown PoolType specified.");
}
