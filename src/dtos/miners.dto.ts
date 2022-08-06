import {
  ClientContract,
  CoinType,
  MinerApiType,
  MinerStatus,
} from "@/interfaces/miners.interface";
import { IsEnum, IsIP, IsObject, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateMinerDto {
  @IsObject()
  public userId: Types.ObjectId;

  @IsString()
  public mac: string;

  @IsIP()
  public ipAddress: string;

  @IsEnum(MinerApiType)
  public API: MinerApiType;

  @IsEnum(CoinType)
  public coin: CoinType;

  @IsObject()
  public contract: ClientContract;

  @IsObject()
  public status: MinerStatus;
}
