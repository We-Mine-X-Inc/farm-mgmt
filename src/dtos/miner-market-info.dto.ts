import { CoinType } from "@/interfaces/coin-market-info.interface";
import { InventoryItem } from "@/interfaces/inventory-item.interface";
import { IsEnum, IsNumber, IsObject } from "class-validator";
import { Types } from "mongoose";

export class CreateMinerMarketInfoDto {
  @IsEnum(CoinType)
  public coinType: CoinType;

  @IsObject()
  public minerInventoryItem: InventoryItem;

  @IsNumber()
  public dailyCoinEarning: number;
}
