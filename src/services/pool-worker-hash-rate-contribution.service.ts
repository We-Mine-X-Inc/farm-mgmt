import {
  AddPoolWorkerHashRateContributionDto,
  ListPoolWorkerHashRateContributionRequestDto,
  ListPoolWorkerHashRateContributionResponseDto,
} from "@/dtos/pool-worker-hash-rate-contribution.dto";
import { HttpException } from "@/exceptions/HttpException";
import {
  PoolWorkerHashRateContribution,
  PoolWorkerHashRateContributionModel,
} from "@/interfaces/pool-worker-hash-rate-contribution.interface";
import poolWorkerHashRateContributionModel from "@/models/pool-worker-hash-rate-contribution.model";
import { logger } from "@/utils/logger";
import { isEmpty } from "@/utils/util";
import { format as prettyFormat } from "pretty-format";

/** CRUD operations for hash rate metrics for pool workers for a miner. */
class PoolWorkerHashRateContributionService {
  private poolWorkerHashRateContributionModel =
    poolWorkerHashRateContributionModel;

  public async addWorkerHashRateContribution(
    hashRateContribution: AddPoolWorkerHashRateContributionDto
  ) {
    if (isEmpty(hashRateContribution))
      throw new HttpException(
        400,
        "You're not a AddPoolWorkerHashRateContributionDto"
      );

    const existingContributionRecord =
      await this.poolWorkerHashRateContributionModel.find({
        poolUsername: hashRateContribution.poolUsername,
        timeRange: hashRateContribution.timeRange,
      });
    if (existingContributionRecord.length > 0) {
      throw new HttpException(400, "TimeRange for this pool already exists.");
    }

    return await this.poolWorkerHashRateContributionModel
      .create({
        poolUsername: hashRateContribution.poolUsername,
        timeRange: hashRateContribution.timeRange,
        clientWorkers: JSON.stringify(hashRateContribution.clientWorkers),
        companyWorkers: JSON.stringify(hashRateContribution.companyWorkers),
      })
      .then((newContribution) =>
        this.convertPoolWorkerHashRateContribution(newContribution)
      );
  }

  public async getWorkerHashRateContributions(
    request: ListPoolWorkerHashRateContributionRequestDto
  ): Promise<ListPoolWorkerHashRateContributionResponseDto> {
    if (isEmpty(request))
      throw new HttpException(
        400,
        "You're not a ListPoolWorkerHashRateContributionRequestDto"
      );

    const poolWorkerContributions: PoolWorkerHashRateContributionModel[] =
      await this.poolWorkerHashRateContributionModel.find({
        poolUsername: { $in: request.poolUsernames },
        "timeRange.startInMillis": {
          $lte: request.timeRange.endInMillis,
        },
        "timeRange.endInMillis": { $gte: request.timeRange.startInMillis },
      });

    return {
      poolWorkerContributions: poolWorkerContributions.map((model) =>
        this.convertPoolWorkerHashRateContribution(model)
      ),
    };
  }

  private convertPoolWorkerHashRateContribution(
    contributionModel
  ): PoolWorkerHashRateContribution {
    return {
      _id: contributionModel._id,
      timeRange: contributionModel.timeRange,
      poolUsername: contributionModel.poolUsername,
      clientWorkers: JSON.parse(contributionModel.clientWorkers),
      companyWorkers: JSON.parse(contributionModel.companyWorkers),
    };
  }
}

export default PoolWorkerHashRateContributionService;
