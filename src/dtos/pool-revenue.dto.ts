import { PoolRevenue } from "@/interfaces/pool-revenue.interface";
import { Revenue } from "@/interfaces/performance/revenue.interface";
import {
  TimeRange,
  TimeSingleton,
} from "@/interfaces/performance/time.interface";
import { IsArray, IsObject, IsOptional } from "class-validator";

export class AddPoolRevenueDto {
  @IsObject()
  public poolUsername: string;

  @IsObject()
  public timeRange: TimeRange;

  @IsObject()
  public cummulativeProfits: Revenue;
}

export class ListPoolRevenueRequestDto {
  @IsArray()
  public poolUsernames: string[];

  @IsOptional()
  @IsObject()
  public timeRange?: TimeRange;

  @IsOptional()
  @IsObject()
  public timeSingleton?: TimeSingleton;
}

export class ListPoolRevenueResponseDto {
  @IsArray()
  public poolRevenues: PoolRevenue[];
}
