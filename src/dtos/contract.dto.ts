import {
  HostingContract,
  PoolActivity,
  ResaleContract,
} from "@/interfaces/contract.interface";
import { Customer } from "@/interfaces/customer.interface";
import { Miner } from "@/interfaces/miner.interface";
import { IsBoolean, IsObject, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class MutatableContractFields {
  @IsOptional()
  @IsObject()
  public customer?: Customer;

  @IsOptional()
  @IsObject()
  public hostingContract?: HostingContract;

  @IsOptional()
  @IsObject()
  public resaleContract?: ResaleContract;

  @IsOptional()
  @IsObject()
  public poolActivity?: PoolActivity;
}

export class CreateContractDto {
  @IsObject()
  public miner: Miner;

  @IsObject()
  public mutatableContractFields: MutatableContractFields;
}

export class UpdateContractDto {
  @IsObject()
  public contractId: Types.ObjectId;

  @IsObject()
  public mutatedFields: MutatableContractFields;
}
