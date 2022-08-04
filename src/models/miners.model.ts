import { model, Schema, Document } from "mongoose";
import { Miner } from "@interfaces/miners.interface";

enum MinerStatus {
  UNKNOWN,
  OFFLINE,
  ONLINE,
}

const minerContractSchema: Schema = new Schema({
  clientTime: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  totalContractHours: {
    type: Number,
    required: true,
  },
});

const minerStatusSchema: Schema = new Schema({
  lastOnlineDatetime: {
    type: Date,
    required: true,
  },
  status: {
    type: MinerStatus,
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
    type: String,
    required: true,
  },
  coin: {
    type: String,
    required: true,
  },
  contract: minerContractSchema,
  status: minerStatusSchema,
});

const minerModel = model<Miner & Document>("Miner", minerSchema);

export default minerModel;
