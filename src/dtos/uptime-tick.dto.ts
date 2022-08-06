import { IsDate } from "class-validator";
import { Types } from "mongoose";

export class CreateUptimeTickDto {
  @IsDate()
  public datetime: Date;
}
