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
  WORKERS: "items",
  WORKER_NAME: "worker_name",
  HASH_RATE_INFO: "accept_1h",
  HASH_RATE_VALUE: "value",
  HASH_RATE_UNIT: "unit",
};

export function convertPoolMarsWorkerHashRates(data): WorkerContribution {
  return data[DATA_PARAMS.WORKERS].reduce((workerContributions, workerInfo) => {
    const workerName = workerInfo[DATA_PARAMS.WORKER_NAME];
    if (workerName.includes(CLIENT_WORKER_PREFIX)) {
      workerContributions.clientWorkers[workerName] =
        convertPoolMarsWorkerContribution(workerInfo);
    } else if (
      workerName.includes(COMPANY_FEE_WORKER_PREFIX) ||
      workerName.includes(COMPANY_FULL_TIME_WORKER_PREFIX)
    ) {
      workerContributions.companyWorkers[workerName] =
        convertPoolMarsWorkerContribution(workerInfo);
    }
    return workerContributions;
  }, buildInitialWorkerContributions());
}

function convertPoolMarsWorkerContribution(workerInfo): HashRate {
  const hashRateInfo = workerInfo[DATA_PARAMS.HASH_RATE_INFO];
  const hashRateUnit = hashRateInfo[DATA_PARAMS.HASH_RATE_UNIT];
  if (hashRateUnit != "TH/s") {
    logger.error(`Unexpected hash rate unit ${hashRateUnit}.`);
    return { unit: HashRateUnitType.UNKNOWN, quantity: 0 };
  }
  return {
    unit: HashRateUnitType.TERA_PER_SEC,
    quantity: parseFloat(hashRateInfo[DATA_PARAMS.HASH_RATE_VALUE]),
  };
}
