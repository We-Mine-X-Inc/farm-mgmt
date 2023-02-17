import { PoolWorkerHashRateContribution } from "@/interfaces/pool-worker-hash-rate-contribution.interface";
import { model, Schema, Document } from "mongoose";
import { HashRateSchema } from "./performance/hash-rate.model";
import { TimeRangeSchema } from "./performance/time.model";

const poolWorkerHashRateContributionSchema: Schema = new Schema({
  pool: {
    type: Schema.Types.ObjectId,
    ref: "Pool",
    required: true,
  },
  timeRange: {
    ...TimeRangeSchema,
  },
  workerContributions: {
    clientWorkers: {
      type: Schema.Types.Map,
      of: HashRateSchema,
    },
    companyWorkers: {
      type: Schema.Types.Map,
      of: HashRateSchema,
    },
  },
});

const poolWorkerHashRateContributionModel = model<
  PoolWorkerHashRateContribution & Document
>("PoolWorkerHashRateContribution", poolWorkerHashRateContributionSchema);

export default poolWorkerHashRateContributionModel;
