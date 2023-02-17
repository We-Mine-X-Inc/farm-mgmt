import { SupplierQuote } from "@/interfaces/supplier-quote.interface";
import { IsNumber, IsObject, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateSupplierQuoteDto {
  @IsObject()
  public supplier: SupplierQuote;

  @IsString()
  public itemModel: string;

  @IsNumber()
  public unitPrice: number;

  @IsNumber()
  public quantity: number;

  @IsNumber()
  public sourceDateInMillis: number;

  @IsNumber()
  public expirationDateInMillis: number;
}
