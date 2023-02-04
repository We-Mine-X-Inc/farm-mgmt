import {
  HostingContract,
  ResaleContract,
} from "@/interfaces/contract.interface";
import { Customer } from "@/interfaces/customer.interface";
import { Miner } from "@/interfaces/miner.interface";
import { IsBoolean, IsObject, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class CreateContractDto {
  @IsObject()
  public customer: Types.ObjectId | Customer;

  @IsObject()
  public miner: Types.ObjectId | Miner;

  @IsBoolean()
  public isActive: Boolean;

  @IsOptional()
  @IsObject()
  public hostingContract: HostingContract;

  @IsOptional()
  @IsObject()
  public resaleContract: ResaleContract;
}
