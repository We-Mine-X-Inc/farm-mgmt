import { PoolRevenue } from "@/interfaces/pool-revenue.interface";
import { Revenue } from "@/interfaces/performance/revenue.interface";
import { TimeRange } from "@/interfaces/performance/time.interface";
import { IsObject, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class AddPoolRevenueDto {
  @IsObject()
  public poolId: Types.ObjectId;

  @IsObject()
  public timeRange: TimeRange;

  @IsObject()
  public cummulativeProfits: Revenue;
}

export class GetPoolRevenueRequestDto {
  @IsObject()
  public poolId: Types.ObjectId;
}

export class GetPoolRevenueResponseDto {
  @IsObject()
  @IsOptional()
  public poolRevenue: PoolRevenue;
}
