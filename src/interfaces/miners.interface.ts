import { Types } from "mongoose";

export type ClientContract = {
  clientMillis: number;
  companyMillis: number;
  totalContractMillis: number;
  startDate: Date;
};

export enum MinerNetworkStatus {
  UNKNOWN,
  OFFLINE,
  ONLINE,
}

export type MinerStatus = {
  lastOnlineDate: Date;
  networkStatus: MinerNetworkStatus;
};

export enum MinerApiType {
  UNKNOWN,
  ANTMINER,
  GOLDSHELL,
}

export enum CoinType {
  UNKNOWN,
  BITCOIN,
  KADENA,
}

export interface Miner {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  ipAddress: string;
  mac: string;
  API: MinerApiType;
  coin: CoinType;
  contract: ClientContract;
  status: MinerStatus;
}
