import {
  AddPoolRevenueDto,
  ListPoolRevenueRequestDto,
  ListPoolRevenueResponseDto,
} from "@/dtos/pool-revenue.dto";
import { HttpException } from "@/exceptions/HttpException";
import { TimeRange } from "@/interfaces/performance/time.interface";
import { PoolRevenue } from "@/interfaces/pool-revenue.interface";
import poolRevenueModel from "@/models/pool-revenue.model";
import { isEmpty } from "@/utils/util";
import { format as prettyFormat } from "pretty-format";

/** CRUD operations for revenue metrics associated with miners. */
class PoolRevenueService {
  private poolRevenueModel = poolRevenueModel;

  public async addPoolRevenue(poolRevenue: AddPoolRevenueDto) {
    if (isEmpty(poolRevenue))
      throw new HttpException(400, "You're not a AddPoolRevenueDto");

    return await this.poolRevenueModel.create({
      poolUsername: poolRevenue.poolUsername,
      timeRange: poolRevenue.timeRange,
      cummulativeProfits: poolRevenue.cummulativeProfits,
    });
  }

  public async getPoolRevenues(
    request: ListPoolRevenueRequestDto
  ): Promise<ListPoolRevenueResponseDto> {
    if (isEmpty(request))
      throw new HttpException(400, "You're not a AddPoolRevenueDto");

    const specifiedTime = request.timeRange || request.timeSingleton;
    if (!specifiedTime) throw new HttpException(400, "Must specify time.");

    const poolRevenuesPromise = !!request.timeRange
      ? this.buildTimeRangeQuery(request)
      : this.buildTimeSingletonQuery(request);
    const poolRevenues = await poolRevenuesPromise;

    console.log(prettyFormat(poolRevenues));
    return { poolRevenues };
  }

  private buildTimeRangeQuery(request: ListPoolRevenueRequestDto) {
    return this.poolRevenueModel.find({
      $or: [
        {
          // First timeRange if startInMillis lands in the middle a stored range.
          poolUsername: { $in: request.poolUsernames },
          "timeRange.startInMillis": {
            $lte: request.timeRange.startInMillis,
          },
          "timeRange.endInMillis": { $gte: request.timeRange.startInMillis },
        },
        {
          // Middle timeRanges if any exist.
          poolUsername: { $in: request.poolUsernames },
          "timeRange.startInMillis": {
            $gte: request.timeRange.startInMillis,
          },
          "timeRange.endInMillis": { $lte: request.timeRange.endInMillis },
        },
        {
          // Last timeRange if endInMillis lands in the middle a stored range.
          poolUsername: { $in: request.poolUsernames },
          "timeRange.startInMillis": {
            $lte: request.timeRange.endInMillis,
          },
          "timeRange.endInMillis": { $gte: request.timeRange.endInMillis },
        },
      ],
    });
  }

  private buildTimeSingletonQuery(request: ListPoolRevenueRequestDto) {
    return this.poolRevenueModel
      .find({
        poolUsername: { $in: request.poolUsernames },
        "timeRange.startInMillis": {
          $lte: request.timeSingleton.timeInMillis,
        },
        "timeRange.endInMillis": { $gte: request.timeSingleton.timeInMillis },
      })
      .sort({ "timeRange.startInMillis": 1 })
      .limit(1);
  }
}

export default PoolRevenueService;
