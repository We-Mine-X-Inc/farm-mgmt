import { Agenda } from "agenda/es";
import { dbConnection } from "@databases";
import UptimeTickService from "@/services/uptime-tick.service";
import { CreateUptimeTickDto } from "@/dtos/uptime-tick.dto";
import {
  AGENDA_MAX_OVERALL_CONCURRENCY,
  AGENDA_MAX_SINGLE_JOB_CONCURRENCY,
} from "@config";

const JOB_NAMES = {
  UPTIME_PROBE: "Track Process Uptime",
};

class ServerUptimeScheduler {
  private scheduler = new Agenda({
    maxConcurrency: AGENDA_MAX_OVERALL_CONCURRENCY,
    defaultConcurrency: AGENDA_MAX_SINGLE_JOB_CONCURRENCY,
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

    await this.removePreviousJobs();

    this.scheduler.every("1 minutes", JOB_NAMES.UPTIME_PROBE);
  }

  private async removePreviousJobs() {
    (await this.scheduler.jobs()).forEach((job) => job.remove());
  }
}

const serverUptimeScheduler = new ServerUptimeScheduler();

export default serverUptimeScheduler;
