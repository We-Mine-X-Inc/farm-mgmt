import { Types } from "mongoose";
import { HashRate } from "./performance/hash-rate.interface";
import { TimeRange } from "./performance/time.interface";
import { Pool } from "./pool.interface";

export type WorkerMap = { [key: string]: HashRate };

export type WorkerContribution = {
  clientWorkers: WorkerMap;
  companyWorkers: WorkerMap;
};

export type PoolWorkerHashRateContributionModel = {
  _id: Types.ObjectId;
  timeRange: TimeRange;
  poolUsername: string;
  clientWorkers: string;
  companyWorkers: string;
};

export type PoolWorkerHashRateContribution = {
  _id: Types.ObjectId;
  timeRange: TimeRange;
  poolUsername: string;
  clientWorkers: WorkerMap;
  companyWorkers: WorkerMap;
};
