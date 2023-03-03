import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";

export class CreateCustomerDto {
  @IsEmail()
  public email: string;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsOptional()
  @IsPhoneNumber()
  public phoneNumber?: string;

  @IsOptional()
  @IsString()
  public address?: string;

  @IsBoolean()
  public isCompanyCustomer: boolean;
}
