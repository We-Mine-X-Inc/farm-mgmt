import {
  PoolWorkerHashRateContribution,
  WorkerMap,
} from "@/interfaces/pool-worker-hash-rate-contribution.interface";
import { TimeRange } from "@/interfaces/performance/time.interface";
import { IsArray, IsObject, IsString } from "class-validator";
import { Types } from "mongoose";
import { HashRate } from "@/interfaces/performance/hash-rate.interface";

export class AddPoolWorkerHashRateContributionDto {
  @IsString()
  public poolUsername: string;

  @IsObject()
  public timeRange: TimeRange;

  @IsObject()
  public clientWorkers: WorkerMap;

  @IsObject()
  public companyWorkers: WorkerMap;
}

export class ListPoolWorkerHashRateContributionRequestDto {
  @IsString()
  public poolUsername: Types.ObjectId;

  @IsObject()
  public timeRange: TimeRange;
}

export class ListPoolWorkerHashRateContributionResponseDto {
  @IsArray()
  public poolWorkerContributions: PoolWorkerHashRateContribution[];
}
