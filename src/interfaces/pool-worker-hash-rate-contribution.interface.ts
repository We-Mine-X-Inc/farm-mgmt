import { Types } from "mongoose";
import { HashRate } from "./performance/hash-rate.interface";
import { TimeRange } from "./performance/time.interface";
import { Pool } from "./pool.interface";

export type WorkerContribution = {
  clientWorkers: Map<string, HashRate>;
  companyWorkers: Map<string, HashRate>;
};

export type PoolWorkerHashRateContribution = {
  _id: Types.ObjectId;
  timeRange: TimeRange;
  pool: Pool;
  workerContributions: WorkerContribution;
};

export const POOL_WORKER_HASH_RATE_CONTRIBUTION_FIELDS_TO_POPULATE = [
  { path: "pool" },
];
