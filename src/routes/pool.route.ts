import { Router } from "express";
import PoolsController from "@/controllers/pool.controller";
import { CreatePoolDto } from "@/dtos/pool.dto";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";

class PoolsRoute implements Routes {
  public path = "/pools";
  public router = Router();
  public poolsController = new PoolsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.poolsController.getPools);
    this.router.get(`${this.path}/:id`, this.poolsController.getPoolById);
    this.router.post(
      `${this.path}`,
      validationMiddleware(CreatePoolDto, "body"),
      this.poolsController.createPool
    );
    this.router.delete(`${this.path}/:id`, this.poolsController.deletePool);
  }
}

export default PoolsRoute;
