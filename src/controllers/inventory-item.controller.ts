import { NextFunction, Request, Response } from "express";
import { CreateInventoryItemDto } from "@/dtos/inventory-item.dto";
import { InventoryItem } from "@/interfaces/inventory-item.interface";
import InventoryItemService from "@services/inventory-item.service";
import { Types } from "mongoose";

/**
 * Controls request/response handling for InventoryItem API calls. This class/object is the first
 * code to be reached after routing.
 */
class InventoryItemsController {
  public inventoryItemService = new InventoryItemService();

  public getInventoryItems = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const findAllInventoryItemsData: InventoryItem[] =
        await this.inventoryItemService.findAllInventoryItems();

      res
        .status(200)
        .json({ data: findAllInventoryItemsData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getInventoryItemById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const inventoryItemId: string = req.params.id;
      const findOneInventoryItemData: InventoryItem =
        await this.inventoryItemService.findInventoryItemById(
          new Types.ObjectId(inventoryItemId)
        );

      res
        .status(200)
        .json({ data: findOneInventoryItemData, message: "findOne" });
    } catch (error) {
      next(error);
    }
  };

  public createInventoryItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const inventoryItemData: CreateInventoryItemDto = req.body;
      const createInventoryItemData: InventoryItem =
        await this.inventoryItemService.createInventoryItem(inventoryItemData);

      res
        .status(201)
        .json({ data: createInventoryItemData, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  public updateInventoryItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const inventoryItemId: string = req.params.id;
      const inventoryItemData: CreateInventoryItemDto = req.body;
      const updateInventoryItemData: InventoryItem =
        await this.inventoryItemService.updateInventoryItem(
          new Types.ObjectId(inventoryItemId),
          inventoryItemData
        );

      res
        .status(200)
        .json({ data: updateInventoryItemData, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  public deleteInventoryItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const inventoryItemId: string = req.params.id;
      const deleteInventoryItemData: InventoryItem =
        await this.inventoryItemService.deleteInventoryItem(
          new Types.ObjectId(inventoryItemId)
        );

      res
        .status(200)
        .json({ data: deleteInventoryItemData, message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}

export default InventoryItemsController;
