import {
  HashRate,
  HashRateUnitType,
} from "@/interfaces/performance/hash-rate.interface";
import { WorkerContribution } from "@/interfaces/pool-worker-hash-rate-contribution.interface";
import {
  CLIENT_WORKER_PREFIX,
  COMPANY_FEE_WORKER_PREFIX,
  COMPANY_FULL_TIME_WORKER_PREFIX,
} from "@/poolswitch/pool-workers";
import { logger } from "@/utils/logger";
import { buildInitialWorkerContributions } from "./builder";

const DATA_PARAMS = {
  BTC_INFO: "btc",
  WORKERS: "workers",
  HASH_RATE_UNIT: "hash_rate_unit",
  HASH_RATE_VALUE: "hash_rate_60m",
};

export function convertSlushPoolWorkerHashRates(data): WorkerContribution {
  const workersInfo = data[DATA_PARAMS.BTC_INFO][DATA_PARAMS.WORKERS];

  return Object.keys(workersInfo).reduce((workerContributions, workerName) => {
    if (workerName.includes(CLIENT_WORKER_PREFIX)) {
      workerContributions.clientWorkers.set(
        workerName,
        convertSlushPoolWorkerContribution(workersInfo[workerName])
      );
    } else if (
      workerName.includes(COMPANY_FEE_WORKER_PREFIX) ||
      workerName.includes(COMPANY_FULL_TIME_WORKER_PREFIX)
    ) {
      workerContributions.companyWorkers.set(
        workerName,
        convertSlushPoolWorkerContribution(workersInfo[workerName])
      );
    }
    return workerContributions;
  }, buildInitialWorkerContributions());
}

function convertSlushPoolWorkerContribution(workerInfo): HashRate {
  const hashRateUnit = workerInfo[DATA_PARAMS.HASH_RATE_UNIT];
  if (hashRateUnit != "Gh/s") {
    logger.error(`Unexpected hash rate unit ${hashRateUnit}.`);
    return { unit: HashRateUnitType.UNKNOWN, quantity: 0 };
  }
  return {
    unit: HashRateUnitType.GIGA_PER_SEC,
    quantity: parseFloat(workerInfo[DATA_PARAMS.HASH_RATE_VALUE]),
  };
}
