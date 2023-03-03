import { Miner } from "@/interfaces/miner.interface";
import { HashRate } from "@/interfaces/performance/hash-rate.interface";
import { Revenue } from "@/interfaces/performance/revenue.interface";
import { TimeRange } from "@/interfaces/performance/time.interface";
import {
  WorkerContribution,
  WorkerMap,
} from "@/interfaces/pool-worker-hash-rate-contribution.interface";
import { IsArray, IsNumber, IsObject, IsOptional } from "class-validator";
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

  @IsOptional()
  @IsNumber()
  public profits?: Revenue;

  @IsOptional()
  @IsNumber()
  public averageHashRate?: HashRate;

  @IsArray()
  public contributionRatios: Array<CalculatedWorkerContribution>;
}

export type CalculatedWorkerContribution = {
  poolUsername: string;
  workerName: string;
  hashRate?: HashRate;
  profit?: Revenue;
  timeRange: TimeRange;
};

export type FlattenedWorkerContribution = {
  poolUsername: string;
  workerName: string;
  hashRate: HashRate;
  timeRange: TimeRange;
};
