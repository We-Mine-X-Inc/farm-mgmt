import { format as prettyFormat } from "pretty-format";
import {
  FlattenedWorkerContribution,
  MinerPerformanceRequestDto,
  MinerPerformanceResponseDto,
} from "@/dtos/miner-performance.dto";
import ContractService from "./contract.service";
import PoolWorkerHashRateContributionService from "./pool-worker-hash-rate-contribution.service";
import { TimeRange } from "@/interfaces/performance/time.interface";
import { PoolRevenue } from "@/interfaces/pool-revenue.interface";
import { PoolWorkerHashRateContribution } from "@/interfaces/pool-worker-hash-rate-contribution.interface";
import PoolRevenueService from "./pool-revenue.service";
import { Revenue } from "@/interfaces/performance/revenue.interface";
import { revenueDifference, revenueSum } from "@/arithmetic/revenue-operations";
import { ONE_HOUR_IN_MILLIS } from "@/constants/time";
import { CoinType } from "@/interfaces/coin-market-info.interface";
import { HashRateUnitType } from "@/interfaces/performance/hash-rate.interface";
import { Miner } from "@/interfaces/miner.interface";

const UNKNOWN_REVENUE = { amount: 0, coinType: CoinType.UNKNOWN };

type CoallescedPoolRevenues = {
  [key: string]: Revenue;
};

type GroupedPoolContributions = {
  [key: string]: {
    totalHashRate: number;
    workerContributions: FlattenedWorkerContribution[];
  };
};

/**
 * Calculates and serves requested performance data for queried miners and time ranges.
 */
class MinerPerformanceService {
  private contractService = new ContractService();
  private poolRevenueService = new PoolRevenueService();
  private poolWorkerHashRateContributionService =
    new PoolWorkerHashRateContributionService();

  /**
   * Returns performance metrics: earnings and hash rate contributions, for the specified miner.
   * @param request
   * @returns
   */
  public async getEarningsForMiner(
    request: MinerPerformanceRequestDto
  ): Promise<MinerPerformanceResponseDto> {
    const timeRange = request.timeRange;
    const contract = await this.contractService.findContractByMiner({
      minerId: request.minerId,
    });

    console.log("poolUsernames");
    const poolUsernames = new Set(
      contract.hostingContract.poolMiningOptions.map(
        (poolOption) => poolOption.pool.username
      )
    );
    console.log(prettyFormat(poolUsernames));

    console.log("poolRevenues");
    const poolRevenues = await this.retrievePoolRevenues({
      timeRange,
      poolUsernames,
    });
    console.log(prettyFormat(poolRevenues));

    console.log("recordedWorkerContributionsByPool");
    const recordedWorkerContributionsByPool =
      await this.retievePoolContributions({
        timeRange,
        poolUsernames,
      });
    console.log(prettyFormat(recordedWorkerContributionsByPool));

    console.log("recordedWorkerContributionsByWorker");
    const recordedWorkerContributionsByWorker =
      this.flattenPoolToWorkerContributions(
        recordedWorkerContributionsByPool.poolWorkerContributions
      );
    console.log(prettyFormat(recordedWorkerContributionsByWorker));

    console.log("workersForMinerNonZeroContributions");
    const workersWithNonZeroContributions =
      recordedWorkerContributionsByWorker.filter(
        (workerContribution) => workerContribution.hashRate.quantity > 0
      );
    console.log(prettyFormat(workersWithNonZeroContributions));

    console.log("workerContributionsWithinTimeRange");
    const workerContributionsWithinTimeRange =
      this.truncateWorkerContributionsWithinTimeRange({
        timeRange,
        workerContributions: workersWithNonZeroContributions,
      });
    console.log(prettyFormat(workerContributionsWithinTimeRange));

    console.log("groupedPoolContributions");
    const groupedPoolContributions = workerContributionsWithinTimeRange.reduce(
      (groupedContributions, contribution) => {
        const groupContribution = groupedContributions[
          contribution.poolUsername
        ] || { totalHashRate: 0, workerContributions: [] };
        groupContribution.totalHashRate += contribution.hashRate.quantity;
        groupContribution.workerContributions.push(contribution);
        groupedContributions[contribution.poolUsername] = groupContribution;
        return groupedContributions;
      },
      {} as GroupedPoolContributions
    );
    console.log(prettyFormat(groupedPoolContributions));

    console.log("calculatedWorkerContributions");
    const calculatedWorkerContributions = Object.entries(
      groupedPoolContributions
    ).flatMap(([poolUsername, groupedWorkerContributions]) => {
      console.log(prettyFormat("poolRevenues"));
      console.log(prettyFormat(poolRevenues));
      const totalPoolProfit = poolRevenues[poolUsername];
      return groupedWorkerContributions.workerContributions.map(
        (workerContribution) => {
          const calculatedProfit =
            (totalPoolProfit.amount * workerContribution.hashRate.quantity) /
            groupedWorkerContributions.totalHashRate;
          return {
            poolUsername,
            workerName: workerContribution.workerName,
            timeRange: workerContribution.timeRange,
            hashRate: workerContribution.hashRate,
            profit: {
              amount: calculatedProfit,
              coinType: totalPoolProfit.coinType,
            },
          };
        }
      );
    });
    console.log(prettyFormat(calculatedWorkerContributions));

    console.log("workerContributionsForMiner");
    const workerContributionsForMiner = calculatedWorkerContributions.filter(
      (workerContribution) =>
        workerContribution.workerName
          .toString()
          .includes(contract.miner.friendlyMinerId)
    );
    console.log(prettyFormat(workerContributionsForMiner));

    const doWorkerContributionsExist = workerContributionsForMiner.length > 0;

    if (!doWorkerContributionsExist) {
      return this.getUnknownPerformance(contract.miner, request);
    }

    console.log("summedProfits");
    const summedProfits = workerContributionsForMiner.reduce(
      (summedProfits, workerContribution) =>
        summedProfits + workerContribution.profit.amount,
      0
    );
    console.log(prettyFormat(summedProfits));

    console.log("summedMinerHashRate");
    const summedMinerHashRate = workerContributionsForMiner.reduce(
      (summedHashRate, workerContribution) =>
        summedHashRate + workerContribution.hashRate.quantity,
      0
    );
    console.log(prettyFormat(summedMinerHashRate));

    console.log("averageHashRate");
    const averageHashRate = this.calculateAverageHashRateForMiner({
      miner: contract.miner,
      workerContributions: workersWithNonZeroContributions,
    });
    console.log(prettyFormat(averageHashRate));

    return {
      miner: contract.miner,
      timeRange: request.timeRange,
      averageHashRate: averageHashRate,
      profits: {
        coinType: workerContributionsForMiner[0].profit.coinType,
        amount: summedProfits,
      },
      contributionRatios: workerContributionsForMiner,
    };
  }

  private calculateAverageHashRateForMiner({
    miner,
    workerContributions,
  }: {
    miner: Miner;
    workerContributions: FlattenedWorkerContribution[];
  }) {
    const workerContributionsForMiner = workerContributions.filter(
      (workerContribution) =>
        workerContribution.workerName.toString().includes(miner.friendlyMinerId)
    );
    const averageHashRate = workerContributionsForMiner.reduce(
      (averageHashRate, workerContribution) => {
        return (
          averageHashRate +
          workerContribution.hashRate.quantity /
            workerContributionsForMiner.length
        );
      },
      0
    );
    return {
      unit: workerContributionsForMiner[0].hashRate.unit,
      quantity: averageHashRate,
    };
  }

  private getUnknownPerformance(
    miner: Miner,
    request: MinerPerformanceRequestDto
  ) {
    return {
      miner: miner,
      timeRange: request.timeRange,
      averageHashRate: {
        unit: HashRateUnitType.UNKNOWN,
        quantity: 0,
      },
      profits: {
        coinType: CoinType.UNKNOWN,
        amount: 0,
      },
      contributionRatios: [],
    };
  }

  private async retrievePoolRevenues({
    timeRange,
    poolUsernames,
  }: {
    timeRange: TimeRange;
    poolUsernames: Set<string>;
  }) {
    const poolRevenues = await Promise.all(
      Array.from(poolUsernames).map(async (poolUsername) => {
        const finalRevenue = await this.retrieveFinalRevenue({
          timeRange,
          poolUsername,
        });
        const startRevenue = await this.retrieveStartRevenue({
          timeRange,
          poolUsername,
        });

        // Need to ensure the storage job is setting the correct coinType before
        // uncommenting this portion.
        // const isRevenueUnknown =
        //   finalRevenue.coinType == CoinType.UNKNOWN ||
        //   startRevenue.coinType == CoinType.UNKNOWN;
        return {
          poolUsername,
          amount: revenueDifference(finalRevenue, startRevenue),
        };
      })
    );
    return poolRevenues.reduce((usernameToRevenueMap, poolRevenue) => {
      usernameToRevenueMap[poolRevenue.poolUsername] = poolRevenue.amount;
      return usernameToRevenueMap;
    }, {});
  }

  private async retrieveFinalRevenue({
    timeRange,
    poolUsername,
  }: {
    timeRange: TimeRange;
    poolUsername: string;
  }): Promise<Revenue> {
    const poolRevenuesResponse = await this.poolRevenueService.getPoolRevenues({
      timeSingleton: { timeInMillis: timeRange.endInMillis },
      poolUsernames: [poolUsername],
    });
    return poolRevenuesResponse.poolRevenues[0]
      ? poolRevenuesResponse.poolRevenues[0].cummulativeProfits
      : UNKNOWN_REVENUE;
  }

  private async retrieveStartRevenue({
    timeRange,
    poolUsername,
  }: {
    timeRange: TimeRange;
    poolUsername: string;
  }): Promise<Revenue> {
    const poolRevenuesResponse = await this.poolRevenueService.getPoolRevenues({
      timeSingleton: {
        timeInMillis: timeRange.startInMillis - ONE_HOUR_IN_MILLIS,
      },
      poolUsernames: [poolUsername],
    });

    return poolRevenuesResponse.poolRevenues[0]
      ? poolRevenuesResponse.poolRevenues[0].cummulativeProfits
      : UNKNOWN_REVENUE;
  }

  private async retievePoolContributions({
    timeRange,
    poolUsernames,
  }: {
    timeRange: TimeRange;
    poolUsernames: Set<string>;
  }) {
    return await this.poolWorkerHashRateContributionService.getWorkerHashRateContributions(
      {
        poolUsernames: Array.from(poolUsernames),
        timeRange: timeRange,
      }
    );
  }

  private flattenPoolToWorkerContributions(
    poolContributions: PoolWorkerHashRateContribution[]
  ): FlattenedWorkerContribution[] {
    return poolContributions.flatMap((workerContribution) => {
      const workers = {
        ...workerContribution.clientWorkers,
        ...workerContribution.companyWorkers,
      };
      return Object.entries(workers).map(([workerName, hashRate]) => {
        return {
          poolUsername: workerContribution.poolUsername,
          workerName: workerName,
          hashRate: hashRate,
          timeRange: workerContribution.timeRange,
        };
      });
    });
  }

  private truncateWorkerContributionsWithinTimeRange({
    timeRange,
    workerContributions,
  }: {
    timeRange: TimeRange;
    workerContributions: FlattenedWorkerContribution[];
  }) {
    return workerContributions.map((workerContribution) => {
      let calculatedHashRate = 0;
      let accountedTimeRange = workerContribution.timeRange;
      const totalWorkedTimeRange =
        workerContribution.timeRange.endInMillis -
        workerContribution.timeRange.startInMillis;
      if (
        workerContribution.timeRange.startInMillis < timeRange.startInMillis &&
        workerContribution.timeRange.endInMillis > timeRange.endInMillis
      ) {
        // Requested TimeRange is between the retrieved contribution.
        const timeRatio =
          (timeRange.endInMillis - timeRange.startInMillis) /
          totalWorkedTimeRange;
      } else if (
        workerContribution.timeRange.startInMillis < timeRange.startInMillis
      ) {
        // First contribution in the time series of retrieved contributions.
        const timeRatio =
          (workerContribution.timeRange.endInMillis - timeRange.startInMillis) /
          totalWorkedTimeRange;
        calculatedHashRate = timeRatio * workerContribution.hashRate.quantity;
        accountedTimeRange = {
          startInMillis: timeRange.startInMillis,
          endInMillis: workerContribution.timeRange.endInMillis,
        };
      } else if (
        timeRange.endInMillis < workerContribution.timeRange.endInMillis
      ) {
        // Last contribution in the time series of retrieved contributions.
        const timeRatio =
          (timeRange.endInMillis - workerContribution.timeRange.startInMillis) /
          totalWorkedTimeRange;
        calculatedHashRate = timeRatio * workerContribution.hashRate.quantity;
        accountedTimeRange = {
          startInMillis: workerContribution.timeRange.startInMillis,
          endInMillis: timeRange.endInMillis,
        };
      } else {
        // Middle contribution in the time series of retrieved contributions.
        calculatedHashRate = workerContribution.hashRate.quantity;
      }
      return {
        ...workerContribution,
        timeRange: accountedTimeRange,
        hashRate: {
          unit: workerContribution.hashRate.unit,
          quantity: calculatedHashRate,
        },
      };
    });
  }
}

export default MinerPerformanceService;
