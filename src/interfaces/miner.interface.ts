import { Types } from "mongoose";
import { Customer } from "./customer.interface";
import { InventoryItem } from "./inventory-item.interface";

export enum MinerNetworkStatus {
  UNKNOWN = 0,
  OFFLINE = 1,
  ONLINE = 2,
}

export type MinerStatus = {
  lastOnlineDateInMillis: number;
  networkStatus: MinerNetworkStatus;
  poolIsBeingSwitched: boolean;
};

export type RackLocation = {
  facility: Types.ObjectId;
  rack: string;
  slot: string;
};

export enum MinerApiType {
  UNKNOWN = 0,
  ANTMINER = 1,
  GOLDSHELL = 2,
}

export interface Miner {
  _id: Types.ObjectId;
  owner: Types.ObjectId | Customer;
  inventoryItem: Types.ObjectId | InventoryItem;
  ipAddress: string;
  macAddress: string;
  API: MinerApiType;
  status: MinerStatus;
  rackLocation: RackLocation;
}
