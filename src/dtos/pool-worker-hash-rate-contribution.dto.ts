import {
  PoolWorkerHashRateContribution,
  WorkerContribution,
} from "@/interfaces/pool-worker-hash-rate-contribution.interface";
import { TimeRange } from "@/interfaces/performance/time.interface";
import { IsArray, IsObject } from "class-validator";
import { Types } from "mongoose";

export class AddPoolWorkerHashRateContributionDto {
  @IsObject()
  public poolId: Types.ObjectId;

  @IsObject()
  public timeRange: TimeRange;

  @IsObject()
  public workerContributions: WorkerContribution;
}

export class ListPoolWorkerHashRateContributionRequestDto {
  @IsObject()
  public poolId: Types.ObjectId;

  @IsObject()
  public timeRange: TimeRange;
}

export class ListPoolWorkerHashRateContributionResponseDto {
  @IsArray()
  public poolWorkerContributions: PoolWorkerHashRateContribution[];
}
