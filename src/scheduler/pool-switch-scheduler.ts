import { Agenda } from "agenda/es";
import { dbConnection } from "@databases";
import MinerService from "@/services/miner.service";
import PoolService from "@/services/pool.service";
import { Miner } from "@/interfaces/miner.interface";
import { PoolPurposeType } from "@/interfaces/pool.interface";
import {
  AGENDA_MAX_OVERALL_CONCURRENCY,
  AGENDA_MAX_SINGLE_JOB_CONCURRENCY,
} from "@config";
import { Types } from "mongoose";
import { agendaSchedulerManager } from "./agenda-scheduler-manager";
import ContractService from "@/services/contract.service";
import { logger } from "@/utils/logger";
import {
  POOL_SWITCH_FUNCTION,
  POOL_VERIFICATION_FUNCTION,
  REBOOT_MINER_FUNCTION,
} from "@/poolswitch/maps-of-miner-commands";
import {
  sendFailureSwitchEmail,
  sendSuccessfulSwitchEmail,
} from "@/alerts/notifications";
import { format as prettyFormat } from "pretty-format";
import { ONE_HOUR_IN_MILLIS, TEN_MINS_IN_MILLIS } from "@/constants/time";

const JOB_NAMES = {
  SWITCH_POOL: "Switch Pool",
  VERIFY_POOL_SWITCH: "Verify Pool Switch",
};

type PoolSwitchingOptions = {
  activePoolStateIndex: number;
};

type PoolSwitchJobData = PoolSwitchingOptions & {
  contractId: Types.ObjectId;
  minerId: Types.ObjectId;
  previousJobId: Types.ObjectId;
  isCompanyPool: boolean;
  isContractCompleted: boolean;
  successfulSwitches: number;
  failedSwitches: number;
  currentSwitchCount: number;
};

type VerifyPoolSwitchJobData = PoolSwitchJobData & {
  attemptCount: number;
};

let poolSwitchScheduler;

class PoolSwitchScheduler {
  private contractService: ContractService = new ContractService();
  private minerService: MinerService = new MinerService();
  private poolService: PoolService = new PoolService();
  private scheduler: Agenda = agendaSchedulerManager.create({
    maxConcurrency: AGENDA_MAX_OVERALL_CONCURRENCY,
    defaultConcurrency: AGENDA_MAX_SINGLE_JOB_CONCURRENCY,
    db: { address: dbConnection.url, collection: "poolSwitchJobs" },
  });
  private isSchedulerStarted: boolean = false;

  static get(): PoolSwitchScheduler {
    if (poolSwitchScheduler) {
      return poolSwitchScheduler;
    }
    poolSwitchScheduler = new PoolSwitchScheduler();
    return poolSwitchScheduler;
  }

  private constructor() {
    this.loadTasksDefinitions();
  }

  /**
   * Loads all of the task definitions needed for pool switching operations.
   */
  private loadTasksDefinitions() {
    this.loadSwitchPoolTask();
    this.loadVerifyPoolSwitchTask();
  }

  private loadSwitchPoolTask() {
    this.scheduler.define(JOB_NAMES.SWITCH_POOL, async (job) => {
      const jobData: PoolSwitchJobData = job.attrs.data;
      const contract = await this.contractService.findContractById(
        jobData.contractId
      );
      const miner = await this.minerService.findMinerById(jobData.minerId);

      // Switch to company revenue pool if contract completed.
      const isContractCompleted =
        contract.hostingContract.contractDuration.endDateInMillis <= Date.now();
      const pool = await this.poolService.findPoolById(
        isContractCompleted
          ? contract.hostingContract.finalCompanyPool._id
          : contract.hostingContract.poolMiningOptions[
              jobData.activePoolStateIndex
            ].pool._id
      );

      const poolSwitchFunction = POOL_SWITCH_FUNCTION[miner.API];
      await poolSwitchFunction({ miner, pool })
        .catch((error) => {
          logger.error(error);
        })
        .finally(async () => {
          await this.contractService.updateContract({
            contractId: contract._id,
            mutatedFields: {
              poolActivity: {
                expectedActivePoolIndex:
                  (jobData.activePoolStateIndex + 1) %
                  contract.hostingContract.poolMiningOptions.length,
              },
            },
          });
          const attemptCount = 1;
          const elapsedTimeBeforeVerifying = new Date(
            Date.now() + this.getTimeToWaitBeforeVerifyPoolSwitch(attemptCount)
          );
          const updatedJobData = {
            ...jobData,
            attemptCount,
            isContractCompleted,
            previousJobId: job.attrs._id,
            isCompanyPool:
              pool.purpose == PoolPurposeType.MINING_FEE ||
              pool.purpose == PoolPurposeType.PURE_COMPANY_REVENUE,
          };
          return this.scheduler.schedule(
            elapsedTimeBeforeVerifying,
            JOB_NAMES.VERIFY_POOL_SWITCH,
            updatedJobData
          );
        });
    });
  }

  private loadVerifyPoolSwitchTask() {
    this.scheduler.define(JOB_NAMES.VERIFY_POOL_SWITCH, async (job) => {
      const jobData: VerifyPoolSwitchJobData = job.attrs.data;
      const contract = await this.contractService.findContractById(
        jobData.contractId
      );
      const miner = await this.minerService.findMinerById(contract.miner._id);
      const pool = await this.poolService.findPoolById(
        contract.hostingContract.poolMiningOptions[jobData.activePoolStateIndex]
          .pool._id
      );
      const poolVerificationFunction = POOL_VERIFICATION_FUNCTION[miner.API];
      const rebootMinerFunction = REBOOT_MINER_FUNCTION[miner.API];
      const verifyPoolParams = { miner, pool };

      await poolVerificationFunction(verifyPoolParams)
        .then(() => {
          sendSuccessfulSwitchEmail(verifyPoolParams);

          if (jobData.isContractCompleted) {
            return Promise.resolve();
          }

          const elapsedTimeBeforeSwitching = new Date(
            Date.now() +
              contract.hostingContract.poolMiningOptions[
                jobData.activePoolStateIndex
              ].miningDurationInMillis
          );
          const updatedJobData = {
            ...jobData,
            activePoolStateIndex:
              (jobData.activePoolStateIndex + 1) %
              contract.hostingContract.poolMiningOptions.length,
            previousJobId: job.attrs._id,
            successfulSwitches: jobData.successfulSwitches + 1,
            currentSwitchCount: jobData.currentSwitchCount + 1,
          };
          return this.scheduler.schedule(
            elapsedTimeBeforeSwitching,
            JOB_NAMES.SWITCH_POOL,
            updatedJobData
          );
        })
        .catch((error) => {
          logger.error(error);
          sendFailureSwitchEmail({ verifyPoolParams, error });

          const attemptCount = jobData.attemptCount + 1;
          const elapsedTimeBeforeVerifying = new Date(
            Date.now() + this.getTimeToWaitBeforeVerifyPoolSwitch(attemptCount)
          );
          const updatedJobData = {
            ...jobData,
            attemptCount,
            previousJobId: job.attrs._id,
            failedSwitches: jobData.failedSwitches + 1,
          };

          return rebootMinerFunction({ miner, pool }).finally(() => {
            this.scheduler.schedule(
              elapsedTimeBeforeVerifying,
              JOB_NAMES.SWITCH_POOL,
              updatedJobData
            );
          });
        });
    });
  }

  private getTimeToWaitBeforeVerifyPoolSwitch(attemptCount: number) {
    return Math.min(attemptCount * TEN_MINS_IN_MILLIS, ONE_HOUR_IN_MILLIS);
  }

  /**
   * Starts managing the pool switching mechanism for each specified contract.
   * Contracts are specified via their ResourceId.
   *
   * @param contractIds
   */
  public async startPoolSwitching(
    infos: {
      contractId: Types.ObjectId;
      options: PoolSwitchingOptions;
    }[]
  ) {
    await this.startScheduler();

    infos.forEach(async (info) => {
      const contract = await this.contractService.findContractById(
        info.contractId
      );
      const pool = await this.poolService.findPoolById(
        contract.hostingContract.poolMiningOptions[
          info.options.activePoolStateIndex
        ].pool._id
      );
      const miner = await this.minerService.findMinerById(contract.miner._id);
      const jobData: PoolSwitchJobData = {
        ...info.options,
        successfulSwitches: 0,
        failedSwitches: 0,
        currentSwitchCount: 1,
        isContractCompleted: false,
        contractId: contract._id,
        minerId: miner._id,
        previousJobId: null,
        isCompanyPool:
          pool.purpose == PoolPurposeType.MINING_FEE ||
          pool.purpose == PoolPurposeType.PURE_COMPANY_REVENUE,
      };
      await this.scheduler.now(JOB_NAMES.SWITCH_POOL, jobData);
    });
  }

  public async startScheduler() {
    if (this.isSchedulerStarted) {
      return;
    }

    await this.scheduler.start();
    this.isSchedulerStarted = true;
  }
}

export default PoolSwitchScheduler;
