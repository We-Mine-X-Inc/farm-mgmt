import { Miner } from "./miner.interface";
import { HashRate } from "./performance/hash-rate.interface";
import { Revenue } from "./performance/revenue.interface";
import { TimeRange } from "./performance/time.interface";

export type MinerPerformance = {
  miner: Miner;
  timeRange: TimeRange;
  profits: Revenue;
  averageHashRate: HashRate;
};

export const MINER_PERFORMANCE_FIELDS_TO_POPULATE = [{ path: "miner" }];
