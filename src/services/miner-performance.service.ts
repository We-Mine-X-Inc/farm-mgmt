import { HttpException } from "@exceptions/HttpException";
import { MinerPerformance } from "@/interfaces/miner-performance.interface";
import { isEmpty } from "@utils/util";
import { Types } from "mongoose";
import { format as prettyFormat } from "pretty-format";
import {
  MinerPerformanceRequestDto,
  MinerPerformanceResponseDto,
} from "@/dtos/miner-performance.dto";
import poolRevenueModel from "@/models/pool-revenue.model";
import poolWorkerHashRateContributionModel from "@/models/pool-worker-hash-rate-contribution.model";

/**
 * Calculates and serves requested performance data for queried miners and time ranges.
 */
class MinerPerformanceService {
  private poolRevenueModel = poolRevenueModel;
  private poolWorkerHashRateContributionModel =
    poolWorkerHashRateContributionModel;

  public async getMinerPerformance(
    request: MinerPerformanceRequestDto
  ): Promise<MinerPerformanceResponseDto> {
    throw new HttpException(500, "unimplemented");
  }
}

export default MinerPerformanceService;
