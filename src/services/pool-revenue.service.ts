import {
  AddPoolRevenueDto,
  GetPoolRevenueRequestDto,
  GetPoolRevenueResponseDto,
} from "@/dtos/pool-revenue.dto";
import { HttpException } from "@/exceptions/HttpException";
import { PoolRevenue } from "@/interfaces/pool-revenue.interface";
import poolRevenueModel from "@/models/pool-revenue.model";
import { isEmpty } from "@/utils/util";
import { Types } from "mongoose";

/** CRUD operations for revenue metrics associated with miners. */
class PoolRevenueService {
  private poolRevenueModel = poolRevenueModel;

  public addPoolRevenue(poolRevenue: AddPoolRevenueDto) {
    if (isEmpty(poolRevenue))
      throw new HttpException(400, "You're not a AddPoolRevenueDto");

    this.poolRevenueModel.create({
      pool: poolRevenue.poolId,
      timeRange: poolRevenue.timeRange,
      cummulativeProfits: poolRevenue.cummulativeProfits,
    });
  }
}

export default PoolRevenueService;
