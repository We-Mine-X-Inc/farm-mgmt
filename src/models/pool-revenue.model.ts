import { PoolRevenue } from "@/interfaces/pool-revenue.interface";
import { model, Schema, Document } from "mongoose";
import { RevenueSchema } from "./performance/revenue.model";
import { TimeRangeSchema } from "./performance/time.model";

const poolRevenueSchema: Schema = new Schema({
  pool: {
    type: Schema.Types.ObjectId,
    ref: "Pool",
    required: true,
  },
  timeRange: {
    ...TimeRangeSchema,
  },
  cummulativeProfits: {
    ...RevenueSchema,
  },
});

const poolRevenueModel = model<PoolRevenue & Document>(
  "PoolRevenue",
  poolRevenueSchema
);

export default poolRevenueModel;
