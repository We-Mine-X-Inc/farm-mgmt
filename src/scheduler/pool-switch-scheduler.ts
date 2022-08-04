import { Agenda } from "agenda/es";
import { dbConnection } from "@databases";
import { SwitchPoolParams } from "@/poolswitch/common-types";
import { switchAntminerPool } from "@/poolswitch/antminer-switcher";
import { switchGoldshellPool } from "@/poolswitch/goldshell-switcher";
import MinerService from "@/services/miners.service";
import PoolService from "@/services/pools.service";

const HOURS_IN_DAY = 24;
const MILLIS_PER_HOUR = 60 * 60 * 1000;

const POOL_SWITCH_STATUS = {
  CLIENT_SESSION_COMPLETED: "CLIENT_SESSION_COMPLETED",
  COMPANY_SESSION_COMPLETED: "COMPANY_SESSION_COMPLETED",
  CONTRACT_COMPLETED: "CONTRACT_COMPLETED",
};

enum MinerApiType {
  ANTMINER,
  GOLDSHELL,
}

type MinerSwitchPoolContract = {
  clientHours: number;
  totalContractHours: number;
  minerId: number;
};

const JOB_NAMES = {
  UPTIME_PROBE: "Track Process Uptime",
  SWITCH_TO_CLIENT_POOL: "Switch to Client Pool",
  SWITCH_TO_COMPANY_POOL: "Switch to Company Pool",
};

const POOL_SWITCH_FUNCTION = {
  [MinerApiType.ANTMINER]: switchAntminerPool,
  [MinerApiType.GOLDSHELL]: switchGoldshellPool,
};

class PoolSwitchScheduler {
  private minerService: MinerService = new MinerService();
  private poolService: PoolService = new PoolService();
  private scheduler = new Agenda({
    db: { address: dbConnection.url, collection: "poolSwitchJobs" },
  });

  constructor() {
    this.loadTasksDefinitions();
  }

  /**
   * Loads all of the task definitions needed for pool switching operations.
   * These tasks must be loaded so that calls to `startNewJobs` or
   * `startUnfinishedJobs` successfully complete.
   */
  private loadTasksDefinitions() {
    // Define Switch to Client Pool Task.
    this.scheduler.define(JOB_NAMES.SWITCH_TO_CLIENT_POOL, async (job) => {
      const {
        remainingTimeOfTotalContract,
        remainingTimePerIteration,
        contract,
      } = job.attrs.data;

      const miner = await this.minerService.findMinerById(contract.minerId);
      const clientPool = await this.poolService.findPoolByMinerId(
        contract.minerId
      );

      // Switch to client pool.
      const poolSwitchFunction = POOL_SWITCH_FUNCTION[miner.API];
      const poolSwitchParams = {
        machineAddress: miner.ipAddress,
        clientPool: { url: clientPool.url, username: clientPool.username },
        toClientPool: true,
      };
      await poolSwitchFunction(poolSwitchParams);

      // Switch back to company pool once time is up.
      return new Promise(function (resolve) {
        setTimeout(() => {
          const updatedJobData = {
            remainingTimeOfTotalContract:
              remainingTimeOfTotalContract - remainingTimePerIteration,
            remainingTimePerIteration: HOURS_IN_DAY - contract.clientHours,
            contract: contract,
          };
          this.scheduler.now(JOB_NAMES.SWITCH_TO_COMPANY_POOL, updatedJobData);
          resolve(POOL_SWITCH_STATUS.CLIENT_SESSION_COMPLETED);
        }, remainingTimePerIteration * MILLIS_PER_HOUR);
      });
    });

    // Define Switch to Company Pool Task.
    this.scheduler.define(JOB_NAMES.SWITCH_TO_COMPANY_POOL, async (job) => {
      const {
        remainingTimeOfTotalContract,
        remainingTimePerIteration,
        contract,
      } = job.attrs.data;

      const miner = await this.minerService.findMinerById(contract.minerId);
      const clientPool = await this.poolService.findPoolByMinerId(
        contract.minerId
      );

      // Switch to client pool.
      const poolSwitchFunction = POOL_SWITCH_FUNCTION[miner.API];
      const poolSwitchParams = {
        machineAddress: miner.ipAddress,
        clientPool: { url: clientPool.url, username: clientPool.username },
        toClientPool: false,
      };
      await poolSwitchFunction(poolSwitchParams);

      return new Promise(function (resolve) {
        if (remainingTimeOfTotalContract <= 0) {
          resolve(POOL_SWITCH_STATUS.CONTRACT_COMPLETED);
        } else {
          setTimeout(() => {
            const updatedJobData = {
              remainingTimeOfTotalContract: remainingTimeOfTotalContract,
              remainingTimePerIteration: contract.clientHours,
              contract: contract,
            };
            this.scheduler.now(JOB_NAMES.SWITCH_TO_CLIENT_POOL, updatedJobData);
            resolve(POOL_SWITCH_STATUS.COMPANY_SESSION_COMPLETED);
          }, remainingTimePerIteration * MILLIS_PER_HOUR);
        }
      });
    });
  }

  /**
   * Starts a new job task per contract provided within the list of contracts.
   *
   * @param minerSwitchPoolContracts info to switch miner's pool to the client's.
   */
  public startNewJobs(minerSwitchPoolContracts: MinerSwitchPoolContract[]) {
    minerSwitchPoolContracts.forEach((contract) => {
      this.scheduler.now(JOB_NAMES.SWITCH_TO_CLIENT_POOL, {
        contract: contract,
        remainingTimePerIteration: contract.clientHours,
        remainingTimeOfTotalContract: contract.totalContractHours,
      });
    });
  }

  /**
   * Resumes all pool switching jobs taking into account the proper remaining time
   * of mining for either the client or the company.
   */
  public async resumeUnfinishedJobs() {
    // are jobs unique even though they may have the same name?
    // the data within will definitely be unique?
    // how to save data in the jobs?

    // fetch the uptime job
    // fetch all pool jobs, both SWITCH_TO_CLIENT and SWITCH_TO_COMPANY
    // the job should not contain the field lastFinishedAt
    // timeSpentMining = uptimeTick.lastRunAt - poolJob.lastRunAt
    // start the job again:
    // {poolJob.name, poolJob.data + {remainingTime: poolJob.data.remainingTime - timeSpentMining}}
    // poolJob.data includes {clientPool, clientHours, remainingTimePerIteration, remainingTimeOfTotalContract}

    await this.scheduler.start();

    const jobsMiningToClient = await this.scheduler.jobs({
      name: JOB_NAMES.SWITCH_TO_CLIENT_POOL,
      lastFinishedAt: { $exists: false },
    });

    const jobsMiningToCompany = await this.scheduler.jobs({
      name: JOB_NAMES.SWITCH_TO_COMPANY_POOL,
      lastFinishedAt: { $exists: false },
    });
  }
}

const poolSwitchScheduler = new PoolSwitchScheduler();

export default poolSwitchScheduler;
