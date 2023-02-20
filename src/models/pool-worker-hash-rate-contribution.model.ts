import { PoolWorkerHashRateContribution } from "@/interfaces/pool-worker-hash-rate-contribution.interface";
import { model, Schema, Document } from "mongoose";
import { HashRateSchema } from "./performance/hash-rate.model";
import { TimeRangeSchema } from "./performance/time.model";

const poolWorkerHashRateContributionSchema: Schema = new Schema({
  poolUsername: {
    type: String,
    required: true,
  },
  timeRange: {
    ...TimeRangeSchema,
  },
  clientWorkers: {
    type: String,
    required: true,
    default: JSON.stringify({}),
  },
  companyWorkers: {
    type: String,
    required: true,
    default: JSON.stringify({}),
  },
});

const poolWorkerHashRateContributionModel = model<
  PoolWorkerHashRateContribution & Document
>("PoolWorkerHashRateContribution", poolWorkerHashRateContributionSchema);

export default poolWorkerHashRateContributionModel;
