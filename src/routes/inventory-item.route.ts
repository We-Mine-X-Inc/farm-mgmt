import { Router } from "express";
import InventoryItemsController from "@/controllers/inventory-item.controller";
import { CreateInventoryItemDto } from "@/dtos/inventory-item.dto";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";

class InventoryItemsRoute implements Routes {
  public path = "/inventoryItems";
  public router = Router();
  public inventoryItemsController = new InventoryItemsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      this.inventoryItemsController.getInventoryItems
    );
    this.router.get(
      `${this.path}/:id`,
      this.inventoryItemsController.getInventoryItemById
    );
    this.router.post(
      `${this.path}`,
      validationMiddleware(CreateInventoryItemDto, "body"),
      this.inventoryItemsController.createInventoryItem
    );
    this.router.put(
      `${this.path}/:id`,
      validationMiddleware(CreateInventoryItemDto, "body", true),
      this.inventoryItemsController.updateInventoryItem
    );
    this.router.delete(
      `${this.path}/:id`,
      this.inventoryItemsController.deleteInventoryItem
    );
  }
}

export default InventoryItemsRoute;
