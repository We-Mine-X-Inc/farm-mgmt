import { Agenda } from "agenda/es";
import { dbConnection } from "@databases";
import MinerService from "@/services/miner.service";
import {
  AGENDA_MAX_OVERALL_CONCURRENCY,
  AGENDA_MAX_SINGLE_JOB_CONCURRENCY,
} from "@config";
import { agendaSchedulerManager } from "./agenda-scheduler-manager";
import { logger } from "@/utils/logger";
import ContractService from "@/services/contract.service";
import PoolSwitchScheduler from "./pool-switch-scheduler";
import FacilityInfoService from "@/services/facility-info.service";
import { jobErrorCatcher } from "./job-error-catcher";
import {
  FAN_SPEED_VERIFICATION_FUNCTION,
  HASHRATE_VERIFICATION_FUNCTION,
  POOL_VERIFICATION_FUNCTION,
  TEMPERATURE_VERIFICATION_FUNCTION,
} from "@/poolswitch/miner-operation-maps";
import { MinerNetworkStatus } from "@/interfaces/miner.interface";
import {
  sendMinerOfflineNotification,
  sendMinerOnlineNotification,
} from "@/alerts/notifications";

const JOB_NAMES = {
  STATUS_PROBE: "Track Miner Status",
};

let minerStatusScheduler;

/**
 * Periodically checks miner health for all miners. Responsible for validating:
 *    - online status
 *    - hashRate
 *    - temperature
 *    - fan speed
 *    - pool setting
 * Execution happens in-sync to avoid overwhelming a miner.
 */
class MinerStatusScheduler {
  private scheduler: Agenda = agendaSchedulerManager.create({
    maxConcurrency: AGENDA_MAX_OVERALL_CONCURRENCY,
    defaultConcurrency: AGENDA_MAX_SINGLE_JOB_CONCURRENCY,
    db: { address: dbConnection.url, collection: "minerStatusJobs" },
  });
  private contractService = new ContractService();
  private minerService = new MinerService();
  private facilityInfoService = new FacilityInfoService();
  private poolSwitchScheduler = PoolSwitchScheduler.get();
  private isSchedulerStarted = false;

  static get() {
    if (minerStatusScheduler) {
      return minerStatusScheduler;
    }
    minerStatusScheduler = new MinerStatusScheduler();
    return minerStatusScheduler;
  }

  private constructor() {
    this.loadTasksDefinitions();
  }

  private loadTasksDefinitions() {
    this.scheduler.define(
      JOB_NAMES.STATUS_PROBE,
      jobErrorCatcher(async (job) => {
        // Replace with logic that is per machine and within the RackInfo.
        const facilityInfos =
          await this.facilityInfoService.findAllFacilityInfos();
        if (!facilityInfos[0].isAutoManaged) {
          return;
        }

        // Do not ping a miner if it's being switched. Need to also handle company miners.
        const miners = (await this.minerService.findAllMiners()).filter(
          (miner) => !miner.status.poolIsBeingSwitched
        );

        for (let miner of miners) {
          const pools = (
            await this.contractService.findContractByMiner({
              minerId: miner._id,
            })
          ).hostingContract.poolMiningOptions;
          const activePoolIndex =
            this.poolSwitchScheduler.getActivePoolIndexForMiner(miner);
          const checkHashRate = HASHRATE_VERIFICATION_FUNCTION[miner.API];
          const checkTemperature = TEMPERATURE_VERIFICATION_FUNCTION[miner.API];
          const checkFanSpeed = FAN_SPEED_VERIFICATION_FUNCTION[miner.API];
          const checkPoolStatus = POOL_VERIFICATION_FUNCTION[miner.API];
          const previousStatus = miner.status.networkStatus;

          await checkPoolStatus({ miner, pool: pools[activePoolIndex].pool })
            .then(() => checkHashRate(miner))
            .then(() => checkFanSpeed(miner))
            .then(() => checkTemperature(miner))
            .then(() => {
              // Previously offline and now back online.
              if (previousStatus == MinerNetworkStatus.OFFLINE) {
                const newMinerInfo = {
                  ...miner,
                  status: {
                    ...miner.status,
                    lastOnlineDate: new Date(),
                    networkStatus: MinerNetworkStatus.ONLINE,
                  },
                };
                return this.minerService
                  .updateMiner(miner._id, newMinerInfo)
                  .then(() => {
                    sendMinerOnlineNotification(miner);
                  });
              }
            })
            .catch(async (error) => {
              // Previously online and now offline.
              if (previousStatus == MinerNetworkStatus.ONLINE) {
                const newMinerInfo = {
                  ...miner,
                  status: {
                    ...miner.status,
                    lastOnlineDate: new Date(),
                    networkStatus: MinerNetworkStatus.OFFLINE,
                  },
                };
                await this.minerService.updateMiner(miner._id, newMinerInfo);
                sendMinerOfflineNotification(miner);
                logger.error(error);
              }
            });
        }
      })
    );
  }

  public async startScheduler() {
    if (this.isSchedulerStarted) {
      return;
    }

    await this.scheduler.start();

    this.isSchedulerStarted = true;
    this.scheduler.every("5 minutes", JOB_NAMES.STATUS_PROBE);
  }
}

export default MinerStatusScheduler;
