import { model, Schema, Document } from "mongoose";
import {
  Miner,
  MinerNetworkStatus,
  MinerApiType,
  CoinType,
} from "@interfaces/miners.interface";

const minerContractSchema: Schema = new Schema({
  clientMillis: {
    type: Number,
    required: true,
  },
  companyMillis: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  totalContractMillis: {
    type: Number,
    required: true,
  },
});

const minerStatusSchema: Schema = new Schema({
  lastOnlineDate: {
    type: Date,
    required: true,
  },
  networkStatus: {
    type: Number,
    enum: MinerNetworkStatus,
    required: true,
  },
});

const minerSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  mac: {
    type: String,
    required: true,
  },
  API: {
    type: Number,
    enum: MinerApiType,
    required: true,
  },
  coin: {
    type: Number,
    enum: CoinType,
    required: true,
  },
  contract: minerContractSchema,
  status: minerStatusSchema,
});

const minerModel = model<Miner & Document>("Miner", minerSchema);

export default minerModel;
