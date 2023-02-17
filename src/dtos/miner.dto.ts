import { Customer } from "@/interfaces/customer.interface";
import { InventoryItem } from "@/interfaces/inventory-item.interface";
import {
  MinerApiType,
  MinerStatus,
  RackLocation,
} from "@/interfaces/miner.interface";
import { IsEnum, IsIP, IsMACAddress, IsObject } from "class-validator";
import { Types } from "mongoose";

export class CreateMinerDto {
  @IsObject()
  public owner: Customer;

  @IsObject()
  public inventoryItem: InventoryItem;

  @IsMACAddress()
  public macAddress: string;

  @IsIP()
  public ipAddress: string;

  @IsEnum(MinerApiType)
  public API: MinerApiType;

  @IsObject()
  public status: MinerStatus;

  @IsObject()
  public rackLocation: RackLocation;
}
