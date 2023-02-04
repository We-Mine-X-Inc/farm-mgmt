import { Types } from "mongoose";

export enum InventoryItemType {
  UNKNOWN = 0,
  MINER = 1,
  ETHERNET_CABLE = 2,
  POWER_CABLE = 3,
  WIFI_ROUTER = 4,
  MINER_FAN = 5,
}

export enum InventoryItemStatus {
  UNKNOWN = 0,
  ORDERED = 1,
  NEEDS_TO_BE_ORDERED = 2,
  DECOMMISIONED = 3,
  NOT_IN_USE = 4,
  IN_USE = 5,
}

export enum HashAlgorithmType {
  UNKNOWN = 0,
  BLAKE_2S = 1,
  SHA_256 = 2,
}

export type NumericRange = {
  minimum: number;
  maximum: number;
};

export type MinerOperationsMetadata = {
  hashAlgorithmType: HashAlgorithmType;
  expectedHashRateRange: NumericRange;
  expectedFanSpeedRange: NumericRange;
  expectedInletTempRange: NumericRange;
  expectedOutletTempRange: NumericRange;
};

export type OperationalMetadata = {
  minerMetadata?: MinerOperationsMetadata;
};

export interface InventoryItem {
  _id: Types.ObjectId;
  type: InventoryItemType;
  status: InventoryItemStatus;
  model: string;
  operationalDependencies: [Types.ObjectId | InventoryItem];
  operationalMetadata: OperationalMetadata;
}
