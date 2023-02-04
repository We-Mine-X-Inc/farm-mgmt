import { model, Schema, Document } from "mongoose";
import { SupplierQuote } from "@/interfaces/supplier-quote.interface";

const supplierQuoteSchema: Schema = new Schema({
  supplierId: {
    type: Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  itemModel: {
    type: String,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  sourceDateInMillis: {
    type: Number,
    required: true,
  },
  expirationDateInMillis: {
    type: Number,
    required: false,
  },
});

const supplierQuoteModel = model<SupplierQuote & Document>(
  "SupplierQuote",
  supplierQuoteSchema
);

export default supplierQuoteModel;
