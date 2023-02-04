import { Miner, MinerApiType } from "@/interfaces/miner.interface";
import {
  rebootAntminerMiner,
  switchAntminerPool,
  verifyAntminerFanSpeed,
  verifyAntminerHashrate,
  verifyAntminerPool,
  verifyAntminerTemperature,
} from "./antminer-operations";
import { SwitchPoolParams, VerifyPoolParams } from "./common-types";
import {
  rebootGoldshellMiner,
  switchGoldshellPool,
  verifyGoldshellFanSpeed,
  verifyGoldshellHashrate,
  verifyGoldshellPool,
  verifyGoldshellTemperature,
} from "./goldshell-operations";
import { format as prettyFormat } from "pretty-format";

export const POOL_SWITCH_FUNCTION: Record<
  MinerApiType,
  (p: SwitchPoolParams) => Promise<any>
> = {
  [MinerApiType.UNKNOWN]: switchUnknownPool,
  [MinerApiType.ANTMINER]: switchAntminerPool,
  [MinerApiType.GOLDSHELL]: switchGoldshellPool,
};

export const POOL_VERIFICATION_FUNCTION: Record<
  MinerApiType,
  (p: VerifyPoolParams) => Promise<any>
> = {
  [MinerApiType.UNKNOWN]: verifyUnknownApiPool,
  [MinerApiType.ANTMINER]: verifyAntminerPool,
  [MinerApiType.GOLDSHELL]: verifyGoldshellPool,
};

export const REBOOT_MINER_FUNCTION: Record<
  MinerApiType,
  (p: SwitchPoolParams) => Promise<any>
> = {
  [MinerApiType.UNKNOWN]: rebootUnknownMiner,
  [MinerApiType.ANTMINER]: rebootAntminerMiner,
  [MinerApiType.GOLDSHELL]: rebootGoldshellMiner,
};

export const HASHRATE_VERIFICATION_FUNCTION: Record<
  MinerApiType,
  (miner: Miner) => Promise<any>
> = {
  [MinerApiType.UNKNOWN]: verifyUnknownMinerHashrate,
  [MinerApiType.ANTMINER]: verifyAntminerHashrate,
  [MinerApiType.GOLDSHELL]: verifyGoldshellHashrate,
};

export const FAN_SPEED_VERIFICATION_FUNCTION: Record<
  MinerApiType,
  (miner: Miner) => Promise<any>
> = {
  [MinerApiType.UNKNOWN]: verifyUnknownMinerFanSpeed,
  [MinerApiType.ANTMINER]: verifyAntminerFanSpeed,
  [MinerApiType.GOLDSHELL]: verifyGoldshellFanSpeed,
};

export const TEMPERATURE_VERIFICATION_FUNCTION: Record<
  MinerApiType,
  (miner: Miner) => Promise<any>
> = {
  [MinerApiType.UNKNOWN]: verifyUnknownMinerTemperature,
  [MinerApiType.ANTMINER]: verifyAntminerTemperature,
  [MinerApiType.GOLDSHELL]: verifyGoldshellTemperature,
};

async function switchUnknownPool(params: SwitchPoolParams): Promise<any> {
  throw Error(`Invalid Miner API supplied. Params: ${prettyFormat(params)}`);
}

async function verifyUnknownApiPool(params: VerifyPoolParams): Promise<any> {
  throw Error(`Invalid Miner API supplied. Params: ${prettyFormat(params)}`);
}

async function rebootUnknownMiner(params: SwitchPoolParams): Promise<any> {
  throw Error(`Invalid Miner API supplied. Params: ${prettyFormat(params)}`);
}

async function verifyUnknownMinerHashrate(miner: Miner): Promise<any> {
  throw Error(`Invalid Miner API supplied. Params: ${prettyFormat(miner)}`);
}

async function verifyUnknownMinerFanSpeed(miner: Miner): Promise<any> {
  throw Error(`Invalid Miner API supplied. Params: ${prettyFormat(miner)}`);
}

async function verifyUnknownMinerTemperature(miner: Miner): Promise<any> {
  throw Error(`Invalid Miner API supplied. Params: ${prettyFormat(miner)}`);
}
