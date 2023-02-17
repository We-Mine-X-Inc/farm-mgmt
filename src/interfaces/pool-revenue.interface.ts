import { Types } from "mongoose";
import { Revenue } from "./performance/revenue.interface";
import { TimeRange } from "./performance/time.interface";
import { Pool } from "./pool.interface";

export type PoolRevenue = {
  _id: Types.ObjectId;
  timeRange: TimeRange;
  pool: Pool;
  cummulativeProfits: Revenue;
};

export const POOL_REVENUE_FIELDS_TO_POPULATE = [{ path: "pool" }];
