import {
  InventoryItemStatus,
  InventoryItemType,
  OperationalMetadata,
} from "@/interfaces/inventory-item.interface";
import { IsArray, IsEnum, IsObject, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateInventoryItemDto {
  @IsEnum(InventoryItemType)
  public type: InventoryItemType;

  @IsEnum(InventoryItemStatus)
  public status: InventoryItemStatus;

  @IsString()
  public model: string;

  @IsArray()
  public operationalDependencies: [Types.ObjectId];

  @IsObject()
  public operationalMetadata: OperationalMetadata;
}
