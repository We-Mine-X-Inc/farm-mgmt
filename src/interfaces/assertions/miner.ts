import { Types } from "mongoose";
import { Miner } from "../miner.interface";

export function assertMiner(value: Miner): asserts value is Miner {
  if ((value as Miner).API === undefined) throw new Error("Not an Miner");
}
