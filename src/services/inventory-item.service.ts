import { CreateInventoryItemDto } from "@/dtos/inventory-item.dto";
import { HttpException } from "@exceptions/HttpException";
import { InventoryItem } from "@/interfaces/inventory-item.interface";
import inventoryItemModel from "@/models/inventory-item.model";
import { isEmpty } from "@utils/util";
import { Types } from "mongoose";

/**
 * Serves data from the DB based on the fetched/mutated information.
 */
class InventoryItemService {
  public inventoryItems = inventoryItemModel;

  public async findAllInventoryItems(): Promise<InventoryItem[]> {
    const inventoryItems: InventoryItem[] = await this.inventoryItems
      .find()
      .lean();
    return inventoryItems;
  }

  public async findInventoryItemById(
    inventoryItemId: Types.ObjectId
  ): Promise<InventoryItem> {
    if (isEmpty(inventoryItemId))
      throw new HttpException(400, "You're not inventoryItemId");

    const findInventoryItem: InventoryItem = await this.inventoryItems.findOne({
      _id: inventoryItemId,
    });
    if (!findInventoryItem)
      throw new HttpException(409, "You're not inventoryItem");

    return findInventoryItem;
  }

  public async createInventoryItem(
    inventoryItemData: CreateInventoryItemDto
  ): Promise<InventoryItem> {
    if (isEmpty(inventoryItemData))
      throw new HttpException(400, "You're not inventoryItemData");

    const createInventoryItemData: InventoryItem =
      await this.inventoryItems.create({ ...inventoryItemData });

    return createInventoryItemData;
  }

  public async updateInventoryItem(
    inventoryItemId: Types.ObjectId,
    inventoryItemData: CreateInventoryItemDto
  ): Promise<InventoryItem> {
    if (isEmpty(inventoryItemData))
      throw new HttpException(400, "You're not inventoryItemData");

    const updateInventoryItemById: InventoryItem =
      await this.inventoryItems.findByIdAndUpdate(inventoryItemId, {
        ...inventoryItemData,
      });
    if (!updateInventoryItemById)
      throw new HttpException(409, "You're not inventoryItem");

    return updateInventoryItemById;
  }

  public async deleteInventoryItem(
    inventoryItemId: Types.ObjectId
  ): Promise<InventoryItem> {
    const deleteInventoryItemById: InventoryItem =
      await this.inventoryItems.findByIdAndDelete(inventoryItemId);
    if (!deleteInventoryItemById)
      throw new HttpException(409, "You're not inventoryItem");

    return deleteInventoryItemById;
  }
}

export default InventoryItemService;
