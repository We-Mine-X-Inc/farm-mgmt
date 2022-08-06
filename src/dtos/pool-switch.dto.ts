import { IsNumber, IsObject } from "class-validator";
import { Types } from "mongoose";

export class MinerSwitchPoolContractDto {
  @IsNumber()
  public clientMillis: number;

  @IsNumber()
  public companyMillis: number;

  @IsNumber()
  public totalContractMillis: number;

  @IsObject()
  public minerId: Types.ObjectId;
}
