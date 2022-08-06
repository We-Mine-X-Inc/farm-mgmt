import { model, Schema, Document } from "mongoose";
import { Pool, PoolPurposeType } from "@interfaces/pools.interface";

const poolSchema: Schema = new Schema({
  minerId: {
    type: Schema.Types.ObjectId,
    ref: "Miner",
    required: false,
  },
  url: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  purpose: {
    type: Number,
    enum: PoolPurposeType,
    required: true,
  },
});

const poolModel = model<Pool & Document>("Pool", poolSchema);

export default poolModel;
