import { IsNumber, IsObject } from "class-validator";
import { Types } from "mongoose";

export class StartPoolSwitchDto {
  @IsObject()
  public contractId: Types.ObjectId;

  @IsNumber()
  public startingPoolIndex: string;
}
