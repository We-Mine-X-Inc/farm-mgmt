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
import {
  sendFailureSwitchEmail,
  sendFailureToRemoveInterruptedJob,
  sendResumeSwitchEmail,
  sendSuccessfulSwitchEmail,
} from "@/alerts/notifications";
import { SwitchPoolParams } from "@/poolswitch/common-types";
import mongoose, { Types } from "mongoose";
import { Job } from "agenda";
import { UptimeTick } from "@/interfaces/uptime-tick.interface";

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

type PoolSwitchFunction = (params: SwitchPoolParams) => Promise<any>;

const POOL_SWITCH_FUNCTION = {
  [MinerApiType.ANTMINER]: switchAntminerPool,
  [MinerApiType.GOLDSHELL]: switchGoldshellPool,
};

export type MinerSwitchPoolContract = {
  clientMillis: number;
  companyMillis: number;
  finalContractDateInMillis: number;
  minerId: Types.ObjectId;
};

class PoolSwitchScheduler {
  private minerService: MinerService = new MinerService();
  private poolService: PoolService = new PoolService();
  private uptimeTickService: UptimeTickService = new UptimeTickService();
  private scheduler: Agenda = new Agenda({
    maxConcurrency: AGENDA_MAX_OVERALL_CONCURRENCY,
    defaultConcurrency: AGENDA_MAX_SINGLE_JOB_CONCURRENCY,
    db: { address: dbConnection.url, collection: "poolSwitchJobs" },
  });
  private schedulerStarted: boolean = false;

  constructor() {
    this.loadTasksDefinitions();
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
      const { finalContractDateInMillis, timeUntilNextSwitch, contract } =
        job.attrs.data;

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
      await switchPool({
        poolSwitchFunction,
        poolSwitchParams,
      }).then(() => {
        // Switch back to company pool once time is up.
        const switchStartTime = new Date(Date.now() + timeUntilNextSwitch);
        const updatedJobData = {
          finalContractDateInMillis: finalContractDateInMillis,
          timeUntilNextSwitch: contract.companyMillis,
          contract: contract,
        };
        return this.scheduler.schedule(
          switchStartTime,
          JOB_NAMES.SWITCH_TO_COMPANY_POOL,
          updatedJobData
        );
      });
    });
  }

  private loadSwitchToCompanyPoolTask() {
    this.scheduler.define(JOB_NAMES.SWITCH_TO_COMPANY_POOL, async (job) => {
      const { finalContractDateInMillis, timeUntilNextSwitch, contract } =
        job.attrs.data;

      const miner = await this.minerService.findMinerById(contract.minerId);
      const companyFeePool = await this.poolService.findPool({
        minerId: contract.minerId,
        purpose: PoolPurposeType.MINING_FEE,
      });
      const companyRevenuePool = await this.poolService.findPool({
        minerId: contract.minerId,
        purpose: PoolPurposeType.PURE_COMPANY_REVENUE,
      });

      // Switch to fee pool, or company revenue pool if contract completed.
      const isContractCompleted = finalContractDateInMillis <= Date.now();
      const poolSwitchFunction = POOL_SWITCH_FUNCTION[miner.API];
      const pool = isContractCompleted
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
      await switchPool({
        poolSwitchFunction,
        poolSwitchParams,
      }).then(() => {
        if (isContractCompleted) {
          return;
        }

        const switchStartTime = new Date(Date.now() + timeUntilNextSwitch);
        const updatedJobData = {
          finalContractDateInMillis: finalContractDateInMillis,
          timeUntilNextSwitch: contract.clientMillis,
          contract: contract,
        };
        return this.scheduler.schedule(
          switchStartTime,
          JOB_NAMES.SWITCH_TO_CLIENT_POOL,
          updatedJobData
        );
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

    minerSwitchPoolContracts.forEach(async (contract) => {
      await this.scheduler.now(JOB_NAMES.SWITCH_TO_CLIENT_POOL, {
        contract: contract,
        timeUntilNextSwitch: contract.clientMillis,
        finalContractDateInMillis: contract.finalContractDateInMillis,
      });
    });
  }

  /**
   * Disable jobs associated with the given miner.
   *
   * @param miner The miner to find a job for and disable.
   */
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

  /**
   * Finds the jobs associated with the given miner and resumes them.
   *
   * @param miner The miner to resume a pool switching jobs for.
   */
  public async resumeMinerNetworkInterruptedJob(miner: Miner) {
    const jobs = await this.scheduler.jobs({
      $or: [
        { name: JOB_NAMES.SWITCH_TO_CLIENT_POOL },
        { name: JOB_NAMES.SWITCH_TO_COMPANY_POOL },
      ],
      lastFinishedAt: { $exists: false },
      disabled: true,
    });

    jobs.forEach(async (job: Job) => {
      await job.enable();

      sendResumeSwitchEmail({
        jobInfo: job.attrs,
        jobData: job.attrs.data,
      });
    });
  }

  public async startScheduler() {
    if (!this.schedulerStarted) {
      await this.scheduler.start();
      this.schedulerStarted = true;
    }
  }
}

/**
 * Switches the pool for a given miner.
 *
 * @param params The pool function to use and the pool info to switch to.
 */
async function switchPool(params: {
  poolSwitchFunction: PoolSwitchFunction;
  poolSwitchParams: SwitchPoolParams;
}) {
  await params
    .poolSwitchFunction(params.poolSwitchParams)
    .then(() => {
      sendSuccessfulSwitchEmail({
        switchParams: params.poolSwitchParams,
      });
    })
    .catch((error: Error) => {
      sendFailureSwitchEmail({
        switchParams: params.poolSwitchParams,
        error: error.toString(),
      });
    });
}

const poolSwitchScheduler = new PoolSwitchScheduler();

export default poolSwitchScheduler;
