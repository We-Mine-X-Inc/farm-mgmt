import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateFacilityInfoDto {
  @IsString()
  public name: string;

  @IsString()
  public address: string;

  @IsNumber()
  public estPowerUsageInKiloWatts: number;

  @IsNumber()
  public estPowerCapacityInKiloWatts: number;

  @IsNumber()
  public estPowerCostInMicros: number;

  @IsNumber()
  public farenheitTemp: number;

  @IsString()
  public isAutoManaged: string;
}
