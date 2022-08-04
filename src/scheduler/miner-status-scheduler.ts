import { Agenda } from "agenda/es";
import { dbConnection } from "@databases";

const JOB_NAMES = {
  STATUS_PROBE: "Track Miner Status",
};

class MinerStatusScheduler {
  private scheduler = new Agenda({
    db: { address: dbConnection.url, collection: "minerStatusJobs" },
  });

  // Replace with the miner service
  // Also, get a handle to the Agenda for miner switching
  //   public uptimeTickService: UptimeTickService = new UptimeTickService();

  public loadTasksDefinitions() {
    this.scheduler.define(JOB_NAMES.STATUS_PROBE, async (job) => {
      // fetch all miners from the table
      // send a ping to the miner to see if it's online
      // if online, update the lastUpDatetime of the miner and set "connection: ONLINE"
      //      if previously OFFLINE
      //          fetch associated disabled job
      //          subtract the time it was lastRun from the most recent online status to get the amount of time mining
      //          subtract the amount of time mining from the contractual amount
      //          start a job with that remaining time as the setTimeout
      // if offline, set "connection: OFFLINE"
      //      find the job associated with the miner and and `disable` it
    });
  }

  public async startJobs() {
    await this.scheduler.start();

    this.scheduler.every("5 minutes", JOB_NAMES.STATUS_PROBE);
  }
}

export default MinerStatusScheduler;
