import { Types } from "mongoose";
import { CoinMarketInfo } from "./coin-market-info.interface";
import { Customer } from "./customer.interface";
import { MinerMarketInfo } from "./miner-market-info.interface";
import { Miner } from "./miner.interface";
import { Pool } from "./pool.interface";

export enum MinerHostingConfigurationStage {
  UNKNOWN = 0,
  CLIENT_SETUP_INSTRUCTIONS_SENT = 1,
  CLIENT_SETUP_INFO_RECEIVED = 2,
  MINER_SETUP_COMPLETION_SENT = 3,
  SUCCESSFULLY_HOSTING = 4,
}

export enum MinerResaleStage {
  UNKNOWN = 0,
  MINER_SENT_TO_CUSTOMER = 1,
  SHIPMENT_TRACKING_INFO_SENT = 2,
  MINER_RECEIVED_BY_CUSTOMER = 3,
}

export enum MinerIntakeStage {
  UNKNOWN = 0,
  OWNER_CONTACT_INFO_GATHERED = 1,
  QUOTES_SOURCED = 2,
  CONTRACT_AGREEMENTS_SENT = 3,
  CONTRACT_AGREEMENTS_SIGNED = 4,
  HARDWARE_ORDERS_PLACED = 5,
  SUPPLIER_INVOICES_RECEIVED = 6,
  SHIPMENT_TRACKING_INFO_RECEIVED = 7,
  HARDWARE_REACHED_CUSTOMS = 8,
  HARDWARE_RECEIVED = 9,
  ISOLATED_QA = 10,
  FACILITY_QA = 11,
  RETURNED_TO_SUPPLIER = 12,
  SUCCESSFULLY_INTOOK = 13,
}

export enum ContractStage {
  UNKNOWN = 0,
  ACTIVE = 1,
  IN_ACTIVE = 2,
  CANCELED = 3,
}

export type HostingContract = {
  hostingStage: MinerHostingConfigurationStage;
  contractDuration: ContractDuration;
  finalCompanyPool: Pool;
  poolMiningOptions: Types.Array<PoolMiningOption>;
};

export type ResaleContract = {
  resaleStage: MinerResaleStage;
};

export type ContractDuration = {
  startDateInMillis: number;
  endDateInMillis: number;
};

export type PoolMiningOption = {
  pool: Pool;
  miningDurationInMillis: number;
};

export type MarketInfo = {
  coinMarketInfo: CoinMarketInfo;
  minerMarketInfo: MinerMarketInfo;
};

export interface Contract {
  _id: Types.ObjectId;
  previousContract: Contract;
  customer: Customer;
  miner: Miner;
  contractStage: ContractStage;
  minerIntakeStage: MinerIntakeStage;
  hostingContract?: HostingContract;
  resaleContract?: ResaleContract;
  marketInfoAtRatification: MarketInfo;
}

export const CONTRACT_FIELDS_TO_POPULATE = [
  { path: "customer" },
  { path: "miner" },
  { path: "hostingContract.finalCompanyPool" },
  {
    path: "hostingContract.poolMiningOptions",
    populate: { path: "pool" },
  },
];
