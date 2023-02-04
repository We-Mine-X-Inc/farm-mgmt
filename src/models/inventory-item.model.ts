import { model, Schema, Document } from "mongoose";
import {
  HashAlgorithmType,
  InventoryItem,
  InventoryItemStatus,
  InventoryItemType,
} from "@/interfaces/inventory-item.interface";

const hashRateRangeSchema: Schema = new Schema({
  minimum: {
    type: Number,
    required: true,
  },
  maximum: {
    type: Number,
    required: true,
  },
});

const minerMetadataSchema: Schema = new Schema({
  hashAlgorithmType: {
    type: Number,
    enum: HashAlgorithmType,
    required: true,
  },
  expectedHashRateRange: hashRateRangeSchema,
});

const operationalMetadataSchema: Schema = new Schema({
  minerMetadata: minerMetadataSchema,
});

const inventoryItemSchema: Schema = new Schema({
  operationalDependencies: {
    type: [Schema.Types.ObjectId],
    ref: "InventoryItem",
    required: false,
  },
  inventoryItemType: {
    type: Number,
    enum: InventoryItemType,
    required: true,
  },
  inventoryItemStatus: {
    type: Number,
    enum: InventoryItemStatus,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  operationalMetadata: operationalMetadataSchema,
});

const inventoryItemModel = model<InventoryItem & Document>(
  "InventoryItem",
  inventoryItemSchema
);

export default inventoryItemModel;
