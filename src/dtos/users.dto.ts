import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;
}
