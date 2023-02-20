import {
  AddPoolWorkerHashRateContributionDto,
  ListPoolWorkerHashRateContributionRequestDto,
  ListPoolWorkerHashRateContributionResponseDto,
} from "@/dtos/pool-worker-hash-rate-contribution.dto";
import { HttpException } from "@/exceptions/HttpException";
import { PoolWorkerHashRateContribution } from "@/interfaces/pool-worker-hash-rate-contribution.interface";
import poolWorkerHashRateContributionModel from "@/models/pool-worker-hash-rate-contribution.model";
import { logger } from "@/utils/logger";
import { isEmpty } from "@/utils/util";

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

    const poolWorkerContributions: PoolWorkerHashRateContribution[] =
      await this.poolWorkerHashRateContributionModel.find({
        poolUsername: request.poolUsername,
        "timeRange.startInMillis": {
          $lte: request.timeRange.endInMillis,
        },
        "timeRange.endInMillis": { $gte: request.timeRange.startInMillis },
      });
    return { poolWorkerContributions };
  }

  private convertPoolWorkerHashRateContribution(
    newContributionModel
  ): PoolWorkerHashRateContribution {
    return {
      ...newContributionModel,
      clientWorkers: JSON.parse(newContributionModel.clientWorkers),
      companyWorkers: JSON.parse(newContributionModel.companyWorkers),
    };
  }
}

export default PoolWorkerHashRateContributionService;
