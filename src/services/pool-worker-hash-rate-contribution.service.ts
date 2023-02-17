import {
  AddPoolWorkerHashRateContributionDto,
  ListPoolWorkerHashRateContributionRequestDto,
  ListPoolWorkerHashRateContributionResponseDto,
} from "@/dtos/pool-worker-hash-rate-contribution.dto";
import { HttpException } from "@/exceptions/HttpException";
import {
  PoolWorkerHashRateContribution,
  POOL_WORKER_HASH_RATE_CONTRIBUTION_FIELDS_TO_POPULATE,
} from "@/interfaces/pool-worker-hash-rate-contribution.interface";
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

    return await this.poolWorkerHashRateContributionModel.create({
      pool: hashRateContribution.poolId,
      timeRange: hashRateContribution.timeRange,
      workerContributions: hashRateContribution.workerContributions,
    });
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
      await this.poolWorkerHashRateContributionModel
        .find({
          pool: request.poolId,
          "timeRange.startInMillis": {
            $lte: request.timeRange.endInMillis,
          },
          "timeRange.endInMillis": { $gte: request.timeRange.startInMillis },
        })
        .populate(POOL_WORKER_HASH_RATE_CONTRIBUTION_FIELDS_TO_POPULATE);

    return { poolWorkerContributions };
  }
}

export default PoolWorkerHashRateContributionService;
