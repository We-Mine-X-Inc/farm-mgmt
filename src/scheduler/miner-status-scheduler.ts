import { Agenda } from "agenda/es";
import { dbConnection } from "@databases";
import ping from "ping";
import MinerService from "@/services/miners.service";
import { MinerNetworkStatus } from "@/interfaces/miners.interface";
import {
  AGENDA_MAX_OVERALL_CONCURRENCY,
  AGENDA_MAX_SINGLE_JOB_CONCURRENCY,
} from "@config";
import { agendaSchedulerManager } from "./agenda-scheduler-manager";
import PoolSwitchScheduler from "./pool-switch-scheduler";

const JOB_NAMES = {
  STATUS_PROBE: "Track Miner Status",
};

let minerStatusScheduler;

class MinerStatusScheduler {
  private scheduler: Agenda = agendaSchedulerManager.create({
    maxConcurrency: AGENDA_MAX_OVERALL_CONCURRENCY,
    defaultConcurrency: AGENDA_MAX_SINGLE_JOB_CONCURRENCY,
    db: { address: dbConnection.url, collection: "minerStatusJobs" },
  });
  private minerService = new MinerService();
  private poolSwitchScheduler = PoolSwitchScheduler.get();

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
    this.scheduler.define(JOB_NAMES.STATUS_PROBE, async (job) => {
      (await this.minerService.findAllMiners()).forEach((miner) => {
        ping.sys.probe(miner.ipAddress, async (isAlive) => {
          const previousStatus = miner.status.networkStatus;

          // Previously online and now offline.
          if (!isAlive && previousStatus == MinerNetworkStatus.ONLINE) {
            const newMinerInfo = {
              ...miner,
              status: {
                lastOnlineDate: new Date(),
                networkStatus: MinerNetworkStatus.OFFLINE,
              },
            };
            this.minerService.updateMiner(miner._id, newMinerInfo);
            await this.poolSwitchScheduler.disableJobForMiner(miner);
          }

          // Previously offline and now back online.
          if (isAlive && previousStatus == MinerNetworkStatus.OFFLINE) {
            const newMinerInfo = {
              ...miner,
              status: {
                lastOnlineDate: new Date(),
                networkStatus: MinerNetworkStatus.ONLINE,
              },
            };
            this.minerService.updateMiner(miner._id, newMinerInfo);
            this.poolSwitchScheduler.resumeMinerNetworkInterruptedJob(miner);
          }
        });
      });
    });
  }

  public async startJobs() {
    await this.scheduler.start();

    await this.removePreviousJobs();

    this.scheduler.every("5 minutes", JOB_NAMES.STATUS_PROBE);
  }

  private async removePreviousJobs() {
    (await this.scheduler.jobs()).forEach((job) => job.remove());
  }
}

export default MinerStatusScheduler;
