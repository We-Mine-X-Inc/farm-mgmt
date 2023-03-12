import { Miner } from "@/interfaces/miner.interface";
import { Pool } from "@/interfaces/pool.interface";

export type SwitchPoolParams = {
  miner: Miner;
  pool: Pool;
};

export type VerifyOperationsParams = {
  miner: Miner;
  pool: Pool;
};
