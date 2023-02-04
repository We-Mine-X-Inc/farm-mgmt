import { MgmtPermissions } from "@/interfaces/mgmt-account.interface";
import {
  IsEmail,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";

export class CreateMgmtAccountDto {
  @IsEmail()
  public email: string;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsOptional()
  @IsPhoneNumber()
  public phoneNumber: string;

  @IsOptional()
  @IsString()
  public address: string;

  @IsObject()
  public mgmtPermissions: MgmtPermissions;
}
