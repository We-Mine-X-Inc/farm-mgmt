import { Agenda } from "agenda/es";
import { dbConnection } from "@databases";
import {
  AGENDA_MAX_OVERALL_CONCURRENCY,
  AGENDA_MAX_SINGLE_JOB_CONCURRENCY,
} from "@config";
import { agendaSchedulerManager } from "./agenda-scheduler-manager";
import { logger } from "@/utils/logger";

const LOG_MSG_TO_VERIFY_MONITORING_IS_ONLINE = "VERIFY_SUCCESSFUL_MONITORING";

const JOB_NAMES = {
  UPTIME_PROBE: "Track Monitoring Uptime",
};

let monitoringUptimeScheduler;

class MonitoringUptimeScheduler {
  private scheduler: Agenda = agendaSchedulerManager.create({
    maxConcurrency: AGENDA_MAX_OVERALL_CONCURRENCY,
    defaultConcurrency: AGENDA_MAX_SINGLE_JOB_CONCURRENCY,
    db: { address: dbConnection.url, collection: "monitoringUptimeJobs" },
  });

  private constructor() {
    this.loadTasksDefinitions();
  }

  static get(): MonitoringUptimeScheduler {
    if (monitoringUptimeScheduler) {
      return monitoringUptimeScheduler;
    }
    monitoringUptimeScheduler = new MonitoringUptimeScheduler();
    return monitoringUptimeScheduler;
  }

  private loadTasksDefinitions() {
    this.scheduler.define(JOB_NAMES.UPTIME_PROBE, async (job, done) => {
      logger.info(LOG_MSG_TO_VERIFY_MONITORING_IS_ONLINE);
      done();
    });
  }

  public async startScheduler() {
    await this.scheduler.start();

    await this.removePreviousJobs();

    this.scheduler.every("5 minutes", JOB_NAMES.UPTIME_PROBE);
  }

  private async removePreviousJobs() {
    (await this.scheduler.jobs()).forEach((job) => job.remove());
  }
}

export default MonitoringUptimeScheduler;
