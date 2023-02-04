import { CoinType } from "@/interfaces/coin-market-info.interface";
import {
  Contract,
  ContractStage,
  MinerHostingConfigurationStage,
  MinerIntakeStage,
  MinerResaleStage,
} from "@/interfaces/contract.interface";
import { model, Schema, Document, Types } from "mongoose";

const contractDurationSchema: Schema = new Schema({
  startDateInMillis: {
    type: Number,
    required: true,
  },
  endDateInMillis: {
    type: Number,
    required: true,
  },
});

const poolMiningOptionsSchema: Schema = new Schema({
  pool: {
    type: Schema.Types.ObjectId,
    ref: "Pool",
    required: true,
  },
  miningDurationInMillis: {
    type: Number,
    required: true,
  },
});

const hostingContractSchema: Schema = new Schema({
  hostingStage: {
    type: Number,
    enum: MinerHostingConfigurationStage,
    required: true,
  },
  contractDuration: contractDurationSchema,
  finalCompanyPool: {
    type: Schema.Types.ObjectId,
    ref: "Pool",
    required: true,
  },
  poolMiningOptions: [poolMiningOptionsSchema],
});

const resaleContractSchema: Schema = new Schema({
  resaleStage: {
    type: Number,
    enum: MinerResaleStage,
    required: true,
  },
});

const coinMarketInfoSchema: Schema = new Schema({
  coinType: {
    type: Number,
    enum: CoinType,
    required: true,
  },
  minerInventoryItem: {
    type: Types.ObjectId,
    required: true,
  },
  dailyCoinEarning: {
    type: Number,
    required: true,
  },
});

const minerMarketInfoSchema: Schema = new Schema({
  coinType: {
    type: Number,
    enum: CoinType,
    required: true,
  },
  coinPrice: {
    type: Number,
    required: true,
  },
});

const marketInfoAtRatificationSchema: Schema = new Schema({
  coinMarketInfo: coinMarketInfoSchema,
  minerMarketInfo: minerMarketInfoSchema,
});

const contractSchema: Schema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  miner: {
    type: Schema.Types.ObjectId,
    ref: "Miner",
    required: true,
  },
  contractStage: {
    type: Number,
    enum: ContractStage,
    required: true,
  },
  minerIntakeStage: {
    type: Number,
    enum: MinerIntakeStage,
    required: true,
  },
  hostingContract: hostingContractSchema,
  resaleContract: resaleContractSchema,
  marketInfoAtRatification: marketInfoAtRatificationSchema,
  isActive: {
    type: Boolean,
    required: true,
  },
});

const contractModel = model<Contract & Document>("Contract", contractSchema);

export default contractModel;
