import { model, Schema, Document } from "mongoose";
import {
  Miner,
  MinerNetworkStatus,
  MinerApiType,
} from "@/interfaces/miner.interface";

const minerStatusSchema: Schema = new Schema({
  lastOnlineDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  networkStatus: {
    type: Number,
    enum: MinerNetworkStatus,
    required: true,
  },
  poolIsBeingSwitched: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const rackLocationSchema: Schema = new Schema({
  facility: {
    type: String,
    required: false,
  },
  rack: {
    type: String,
    required: false,
  },
  slot: {
    type: String,
    required: false,
  },
});

const minerSchema: Schema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  inventoryItem: {
    type: Schema.Types.ObjectId,
    ref: "InventoryItem",
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  macAddress: {
    type: String,
    required: true,
  },
  API: {
    type: Number,
    enum: MinerApiType,
    required: true,
  },
  status: minerStatusSchema,
  rackLocation: rackLocationSchema,
});

const minerModel = model<Miner & Document>("Miner", minerSchema);

export default minerModel;
