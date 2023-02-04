import { Miner } from "@/interfaces/miner.interface";
import { Pool } from "@/interfaces/pool.interface";

export type SwitchPoolParams = {
  miner: Miner;
  pool: Pool;
};

export type VerifyPoolParams = {
  miner: Miner;
  pool: Pool;
};
