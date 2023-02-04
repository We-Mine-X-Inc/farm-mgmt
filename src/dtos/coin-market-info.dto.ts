import { CoinType } from "@/interfaces/coin-market-info.interface";
import { IsEnum, IsNumber } from "class-validator";

export class CreateCoinMarketInfoDto {
  @IsEnum(CoinType)
  public coinType: CoinType;

  @IsNumber()
  public coinPrice: number;
}
