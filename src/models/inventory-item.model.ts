import { model, Schema, Document } from "mongoose";
import {
  HashAlgorithmType,
  InventoryItem,
  InventoryItemStatus,
  InventoryItemType,
} from "@/interfaces/inventory-item.interface";

const hashRateRangeSchema = {
  minimum: {
    type: Number,
    required: true,
  },
  maximum: {
    type: Number,
    required: true,
  },
};

const minerMetadataSchema = {
  hashAlgorithmType: {
    type: Number,
    enum: HashAlgorithmType,
    required: true,
  },
  expectedHashRateRange: hashRateRangeSchema,
};

const powerSwitchMetadataSchema = {
  clientDeviceName: {
    type: String,
    required: true,
  },
};

const operationalMetadataSchema = {
  minerMetadata: minerMetadataSchema,
  powerSwitchMetadata: powerSwitchMetadataSchema,
};

const inventoryItemSchema: Schema = new Schema({
  operationalDependencies: {
    type: [Schema.Types.ObjectId],
    ref: "InventoryItem",
    required: false,
  },
  type: {
    type: Number,
    enum: InventoryItemType,
    required: true,
  },
  status: {
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
