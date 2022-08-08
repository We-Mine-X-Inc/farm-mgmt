import { Agenda } from "agenda/es";
import { dbConnection } from "@databases";
import { switchAntminerPool } from "@/poolswitch/antminer-switcher";
import { switchGoldshellPool } from "@/poolswitch/goldshell-switcher";
import MinerService from "@/services/miners.service";
import PoolService from "@/services/pools.service";
import { Miner, MinerApiType } from "@/interfaces/miners.interface";
import { PoolPurposeType } from "@/interfaces/pools.interface";
import UptimeTickService from "@/services/uptime-tick.service";
import {
  AGENDA_MAX_OVERALL_CONCURRENCY,
  AGENDA_MAX_SINGLE_JOB_CONCURRENCY,
} from "@config";

const POOL_SWITCH_STATUS = {
  CLIENT_SESSION_COMPLETED: "CLIENT_SESSION_COMPLETED",
  COMPANY_SESSION_COMPLETED: "COMPANY_SESSION_COMPLETED",
  CONTRACT_COMPLETED: "CONTRACT_COMPLETED",
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

export type MinerSwitchPoolContract = {
  clientMillis: number;
  companyMillis: number;
  totalContractMillis: number;
  minerId: string;
};

class PoolSwitchScheduler {
  private minerService: MinerService = new MinerService();
  private poolService: PoolService = new PoolService();
  private uptimeTickService: UptimeTickService = new UptimeTickService();
  private scheduler = new Agenda({
    maxConcurrency: AGENDA_MAX_OVERALL_CONCURRENCY,
    defaultConcurrency: AGENDA_MAX_SINGLE_JOB_CONCURRENCY,
    db: { address: dbConnection.url, collection: "poolSwitchJobs" },
  });
  private schedulerStarted: boolean = false;

  constructor() {
    this.loadTasksDefinitions();
  }

  private async startScheduler() {
    if (!this.schedulerStarted) {
      await this.scheduler.start();
    }
  }
  /**
   * Loads all of the task definitions needed for pool switching operations.
   * These tasks must be loaded so that calls to `startNewJobs` or
   * `startUnfinishedJobs` successfully complete.
   */
  private loadTasksDefinitions() {
    this.loadSwitchToCompanyPoolTask();
    this.loadSwitchToClientPoolTask();
  }

  private loadSwitchToClientPoolTask() {
    this.scheduler.define(JOB_NAMES.SWITCH_TO_CLIENT_POOL, async (job) => {
      const {
        remainingTimeOfTotalContract,
        remainingTimePerIteration,
        contract,
      } = job.attrs.data;

      const miner = await this.minerService.findMinerById(contract.minerId);
      const clientPool = await this.poolService.findPool({
        minerId: contract.minerId,
        purpose: PoolPurposeType.CLIENT_REVENUE,
      });

      // Switch to client pool.
      const poolSwitchFunction = POOL_SWITCH_FUNCTION[miner.API];
      const poolSwitchParams = {
        macAddress: miner.mac,
        ipAddress: miner.ipAddress,
        pool: { url: clientPool.url, username: clientPool.username },
      };
      await poolSwitchFunction(poolSwitchParams);

      // Switch back to company pool once time is up.
      const scopedScheduler = this.scheduler;
      return new Promise(function (resolve) {
        setTimeout(() => {
          const updatedJobData = {
            remainingTimeOfTotalContract:
              remainingTimeOfTotalContract - remainingTimePerIteration,
            remainingTimePerIteration: contract.companyMillis,
            contract: contract,
          };
          scopedScheduler.now(JOB_NAMES.SWITCH_TO_COMPANY_POOL, updatedJobData);
          resolve(POOL_SWITCH_STATUS.CLIENT_SESSION_COMPLETED);
        }, remainingTimePerIteration);
      });
    });
  }

  private loadSwitchToCompanyPoolTask() {
    this.scheduler.define(JOB_NAMES.SWITCH_TO_COMPANY_POOL, async (job) => {
      const {
        remainingTimeOfTotalContract,
        remainingTimePerIteration,
        contract,
      } = job.attrs.data;

      const miner = await this.minerService.findMinerById(contract.minerId);
      const companyFeePool = await this.poolService.findPool({
        minerId: contract.minerId,
        purpose: PoolPurposeType.MINING_FEE,
      });
      const companyRevenuePool = await this.poolService.findPool({
        minerId: contract.minerId,
        purpose: PoolPurposeType.PURE_COMPANY_REVENUE,
      });

      // Switch to client pool, or company revenue pool if contract completed.
      const poolSwitchFunction = POOL_SWITCH_FUNCTION[miner.API];
      const pool =
        remainingTimeOfTotalContract <= 0
          ? {
              url: companyRevenuePool.url,
              username: companyRevenuePool.username,
            }
          : { url: companyFeePool.url, username: companyFeePool.username };
      const poolSwitchParams = {
        macAddress: miner.mac,
        ipAddress: miner.ipAddress,
        pool: pool,
      };
      await poolSwitchFunction(poolSwitchParams);

      const scopedScheduler = this.scheduler;
      return new Promise(function (resolve) {
        if (remainingTimeOfTotalContract <= 0) {
          resolve(POOL_SWITCH_STATUS.CONTRACT_COMPLETED);
        } else {
          setTimeout(() => {
            const updatedJobData = {
              remainingTimeOfTotalContract: remainingTimeOfTotalContract,
              remainingTimePerIteration: contract.clientMillis,
              contract: contract,
            };
            scopedScheduler.now(
              JOB_NAMES.SWITCH_TO_CLIENT_POOL,
              updatedJobData
            );
            resolve(POOL_SWITCH_STATUS.COMPANY_SESSION_COMPLETED);
          }, remainingTimePerIteration);
        }
      });
    });
  }

  /**
   * Starts a new job task per contract provided within the list of contracts.
   *
   * @param minerSwitchPoolContracts info to switch miner's pool to the client's.
   */
  public async startNewJobs(
    minerSwitchPoolContracts: MinerSwitchPoolContract[]
  ) {
    await this.startScheduler();
    minerSwitchPoolContracts.forEach((contract) => {
      this.scheduler.now(JOB_NAMES.SWITCH_TO_CLIENT_POOL, {
        contract: contract,
        remainingTimePerIteration: contract.clientMillis,
        remainingTimeOfTotalContract: contract.totalContractMillis,
      });
    });
  }

  /**
   * Resumes all pool switching jobs taking into account the proper remaining time
   * of mining for either the client or the company.
   */
  public async resumeServerInterruptedJobs() {
    await this.startScheduler();

    const lastTrackedUptime = await this.uptimeTickService.findMostRecentTick();
    const jobs = await this.scheduler.jobs({
      $or: [
        { name: JOB_NAMES.SWITCH_TO_CLIENT_POOL },
        { name: JOB_NAMES.SWITCH_TO_COMPANY_POOL },
      ],
      lastFinishedAt: { $exists: false },
      disabled: { $exists: false },
    });
    jobs.forEach((job: any) => {
      const updatedJobData = { ...job.attrs.data };
      updatedJobData.remainingTimePerIteration = calculateRemainingTime({
        job,
        lastTrackedUptime,
      });
      this.scheduler.now(job.attrs.name, updatedJobData);
      job.remove();
    });
  }

  public async disableJobForMiner(miner: Miner) {
    await this.scheduler.disable({
      $or: [
        { name: JOB_NAMES.SWITCH_TO_CLIENT_POOL },
        { name: JOB_NAMES.SWITCH_TO_COMPANY_POOL },
      ],
      lastFinishedAt: { $exists: false },
      "data.contract.minerId": miner._id,
    });
  }

  public async resumeMinerNetworkInterruptedJob(miner: Miner) {
    const jobs = await this.scheduler.jobs({
      $or: [
        { name: JOB_NAMES.SWITCH_TO_CLIENT_POOL },
        { name: JOB_NAMES.SWITCH_TO_COMPANY_POOL },
      ],
      lastFinishedAt: { $exists: false },
      disabled: true,
    });

    jobs.forEach((job) => {
      const updatedJobData = { ...job.attrs.data };
      updatedJobData.remainingTimePerIteration = calculateRemainingTime({
        job: job,
        lastTrackedUptime: miner.status.lastOnlineDate,
      });
      this.scheduler.now(job.attrs.name, updatedJobData);
      job.remove();
    });
  }
}

function calculateRemainingTime(params: { job; lastTrackedUptime }): Number {
  const jobStartTime = params.job.attrs.lastRunAt.getTime();
  const timeSpentMining =
    params.lastTrackedUptime.datetime.getTime() - jobStartTime;
  return params.job.attrs.data.remainingTimePerIteration - timeSpentMining;
}

const poolSwitchScheduler = new PoolSwitchScheduler();

export default poolSwitchScheduler;
