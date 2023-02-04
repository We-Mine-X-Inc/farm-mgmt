import { Types } from "mongoose";
import { InventoryItem } from "../inventory-item.interface";

export function assertInventoryItem(
  value: Types.ObjectId | InventoryItem
): asserts value is InventoryItem {
  if ((value as InventoryItem).model === undefined)
    throw new Error("Not an InventoryItem");
}
