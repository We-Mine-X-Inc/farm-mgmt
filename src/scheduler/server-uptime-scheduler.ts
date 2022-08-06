import { Agenda } from "agenda/es";
import { dbConnection } from "@databases";
import UptimeTickService from "@/services/uptime-tick.service";
import { CreateUptimeTickDto } from "@/dtos/uptime-tick.dto";

const JOB_NAMES = {
  UPTIME_PROBE: "Track Process Uptime",
};

class ServerUptimeScheduler {
  private scheduler = new Agenda({
    db: { address: dbConnection.url, collection: "serverUptimeJobs" },
  });

  public uptimeTickService: UptimeTickService = new UptimeTickService();

  constructor() {
    this.loadTasksDefinitions();
  }

  private loadTasksDefinitions() {
    this.scheduler.define(JOB_NAMES.UPTIME_PROBE, async (job, done) => {
      const uptimeTick: CreateUptimeTickDto = { datetime: new Date() };
      await this.uptimeTickService.createUptimeTick(uptimeTick);
      done();
    });
  }

  public async startJobs() {
    await this.scheduler.start();

    this.scheduler.every("5 minutes", JOB_NAMES.UPTIME_PROBE);
  }
}

const serverUptimeScheduler = new ServerUptimeScheduler();

export default serverUptimeScheduler;
