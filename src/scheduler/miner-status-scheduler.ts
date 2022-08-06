import { Agenda } from "agenda/es";
import { dbConnection } from "@databases";
import ping from "ping";
import MinerService from "@/services/miners.service";
import { MinerNetworkStatus } from "@/interfaces/miners.interface";
import poolSwitchScheduler from "./pool-switch-scheduler";

const JOB_NAMES = {
  STATUS_PROBE: "Track Miner Status",
};

class MinerStatusScheduler {
  private scheduler = new Agenda({
    db: { address: dbConnection.url, collection: "minerStatusJobs" },
  });
  private minerService = new MinerService();

  constructor() {
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
            await poolSwitchScheduler.disableJobForMiner(miner);
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
            poolSwitchScheduler.resumeMinerNetworkInterruptedJob(miner);
          }
        });
      });
    });
  }

  public async startJobs() {
    await this.scheduler.start();

    this.scheduler.every("5 minutes", JOB_NAMES.STATUS_PROBE);
  }
}

const minerStatusScheduler = new MinerStatusScheduler();

export default minerStatusScheduler;
