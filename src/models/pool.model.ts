import { model, Schema, Document } from "mongoose";
import { Pool, PoolPurposeType, PoolType } from "@/interfaces/pool.interface";

const poolSchema: Schema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  protocol: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  poolType: {
    type: Number,
    enum: PoolType,
    required: true,
  },
  apiToken: {
    type: String,
    required: false,
  },
  purpose: {
    type: Number,
    enum: PoolPurposeType,
    required: true,
  },
});

const poolModel = model<Pool & Document>("Pool", poolSchema);

export default poolModel;
