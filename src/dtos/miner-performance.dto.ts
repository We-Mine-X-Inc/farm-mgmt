import { Miner } from "@/interfaces/miner.interface";
import { TimeRange } from "@/interfaces/performance/time.interface";
import { IsNumber, IsObject } from "class-validator";
import { Types } from "mongoose";

export class MinerPerformanceRequestDto {
  @IsObject()
  public minerId: Types.ObjectId;

  @IsObject()
  public timeRange: TimeRange;
}

export class MinerPerformanceResponseDto {
  @IsObject()
  public miner: Miner;

  @IsObject()
  public timeRange: TimeRange;

  @IsNumber()
  public profits: number;

  @IsNumber()
  public averageHashRate: number;
}
