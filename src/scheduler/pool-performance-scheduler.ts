import { Agenda } from "agenda/es";
import { dbConnection } from "@databases";
import {
  AGENDA_MAX_OVERALL_CONCURRENCY,
  AGENDA_MAX_SINGLE_JOB_CONCURRENCY,
} from "@config";
import { agendaSchedulerManager } from "./agenda-scheduler-manager";
import PoolRevenueService from "@/services/pool-revenue.service";
import PoolWorkerHashRateContributionService from "@/services/pool-worker-hash-rate-contribution.service";
import PoolService from "@/services/pool.service";
import { fetchRevenueData } from "@/performance/revenue/pool-revenue";
import { fetchWorkerHashRateContributionsData } from "@/performance/hashrate/pool-hashrate";
import { ONE_HOUR_IN_MILLIS } from "@/constants/time";

const JOB_NAMES = {
  COLLECT_REVENUE_METRICS: "Collect Revenue Metrics",
  COLLECT_HASH_RATE_METRICS: "Collect Hash Rate Metrics",
};

let poolPerformanceScheduler;

class PoolPerformanceScheduler {
  private scheduler: Agenda = agendaSchedulerManager.create({
    maxConcurrency: AGENDA_MAX_OVERALL_CONCURRENCY,
    defaultConcurrency: AGENDA_MAX_SINGLE_JOB_CONCURRENCY,
    db: { address: dbConnection.url, collection: "serverUptimeJobs" },
  });

  private poolRevenueService: PoolRevenueService = new PoolRevenueService();
  private poolWorkerHashRateContributionService: PoolWorkerHashRateContributionService =
    new PoolWorkerHashRateContributionService();
  private poolService: PoolService = new PoolService();

  private constructor() {
    this.loadTasksDefinitions();
  }

  static get(): PoolPerformanceScheduler {
    if (poolPerformanceScheduler) {
      return poolPerformanceScheduler;
    }
    poolPerformanceScheduler = new PoolPerformanceScheduler();
    return poolPerformanceScheduler;
  }

  private loadTasksDefinitions() {
    this.scheduler.define(
      JOB_NAMES.COLLECT_HASH_RATE_METRICS,
      async (job, done) => {
        // setMaxListeners(100); // I should set it higher in general since I will often do parallel processing
        const evaluatedPoolUsername = {};
        const pools = await this.poolService.findAllPools();
        for (const pool of pools) {
          if (pool.username in evaluatedPoolUsername) {
            continue;
          }

          evaluatedPoolUsername[pool.username] = true;
          const timeRange = {
            startInMillis: Date.now() - ONE_HOUR_IN_MILLIS,
            endInMillis: Date.now(),
          };
          const workerContributions =
            await fetchWorkerHashRateContributionsData(pool);
          await this.poolWorkerHashRateContributionService.addWorkerHashRateContribution(
            {
              poolUsername: pool.username,
              timeRange,
              clientWorkers: workerContributions.clientWorkers,
              companyWorkers: workerContributions.companyWorkers,
            }
          );
        }
        done();
      }
    );

    this.scheduler.define(
      JOB_NAMES.COLLECT_REVENUE_METRICS,
      async (job, done) => {
        const evaluatedPoolUsername = {};
        const pools = await this.poolService.findAllPools();
        for (const pool of pools) {
          if (pool.username in evaluatedPoolUsername) {
            continue;
          }

          evaluatedPoolUsername[pool.username] = true;
          const timeRange = {
            startInMillis: Date.now() - ONE_HOUR_IN_MILLIS,
            endInMillis: Date.now(),
          };
          const cummulativeProfits = await fetchRevenueData(pool);
          await this.poolRevenueService.addPoolRevenue({
            poolUsername: pool.username,
            timeRange,
            cummulativeProfits,
          });
        }
        done();
      }
    );
  }

  public async startScheduler() {
    await this.scheduler.start();

    await this.removePreviousJobs();

    this.scheduler.every("60 minutes", JOB_NAMES.COLLECT_REVENUE_METRICS);
    this.scheduler.every("60 minutes", JOB_NAMES.COLLECT_HASH_RATE_METRICS);
  }

  private async removePreviousJobs() {
    (await this.scheduler.jobs()).forEach((job) => job.remove());
  }
}

export default PoolPerformanceScheduler;
