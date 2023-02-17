import { Agenda } from "agenda/es";
import { dbConnection } from "@databases";
import {
  AGENDA_MAX_OVERALL_CONCURRENCY,
  AGENDA_MAX_SINGLE_JOB_CONCURRENCY,
} from "@config";
import { agendaSchedulerManager } from "./agenda-scheduler-manager";
import PoolRevenueService from "@/services/pool-revenue.service";
import PoolWorkerHashRateContributionService from "@/services/pool-worker-hash-rate-contribution.service";
import { Types } from "mongoose";
import ContractService from "@/services/contract.service";
import PoolService from "@/services/pool.service";
import { fetchRevenueData } from "@/performance/revenue/pool-revenue";
import { fetchWorkerHashRateContributionsData } from "@/performance/hashrate/pool-hashrate";
import { setMaxListeners } from "events";

const ONE_HOUR_IN_MILLIS = 60 * 60 * 1000;

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

  static get() {
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
        setMaxListeners(100); // I should set it higher in general since I will often do parallel processing
        (await this.poolService.findAllPools()).forEach(async (pool) => {
          const timeRange = {
            startInMillis: Date.now() - ONE_HOUR_IN_MILLIS,
            endInMillis: Date.now(),
          };
          const workerContributions =
            await fetchWorkerHashRateContributionsData(pool);
          console.log("workerContributions");
          console.log(workerContributions);
          await this.poolWorkerHashRateContributionService.addWorkerHashRateContribution(
            {
              poolId: pool._id,
              timeRange,
              workerContributions,
            }
          );
        });
        done();
      }
    );

    this.scheduler.define(
      JOB_NAMES.COLLECT_REVENUE_METRICS,
      async (job, done) => {
        (await this.poolService.findAllPools()).forEach(async (pool) => {
          const timeRange = {
            startInMillis: Date.now() - ONE_HOUR_IN_MILLIS,
            endInMillis: Date.now(),
          };
          const cummulativeProfits = await fetchRevenueData(pool);
          await this.poolRevenueService.addPoolRevenue({
            poolId: pool._id,
            timeRange,
            cummulativeProfits,
          });
        });
        done();
      }
    );
  }

  public async startScheduler() {
    await this.scheduler.start();

    await this.removePreviousJobs();

    // this.scheduler.every("60 minutes", JOB_NAMES.COLLECT_REVENUE_METRICS);
    this.scheduler.every("60 minutes", JOB_NAMES.COLLECT_HASH_RATE_METRICS);
  }

  private async removePreviousJobs() {
    (await this.scheduler.jobs()).forEach((job) => job.remove());
  }
}

export default PoolPerformanceScheduler;
