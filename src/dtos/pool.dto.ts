import { Customer } from "@/interfaces/customer.interface";
import { PoolPurposeType, PoolType } from "@/interfaces/pool.interface";
import { IsEnum, IsObject, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreatePoolDto {
  @IsObject()
  public creator: Types.ObjectId | Customer;

  @IsString()
  public protocol: string;

  @IsString()
  public domain: string;

  @IsString()
  public username: string;

  @IsEnum(PoolType)
  public poolType: PoolType;

  @IsEnum(PoolPurposeType)
  public purpose: PoolPurposeType;
}
