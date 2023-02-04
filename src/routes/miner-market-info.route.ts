import { Router } from "express";
import MinerMarketInfosController from "@/controllers/miner-market-info.controller";
import { CreateMinerMarketInfoDto } from "@/dtos/miner-market-info.dto";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";

class MinerMarketInfosRoute implements Routes {
  public path = "/minerMarketInfos";
  public router = Router();
  public minerMarketInfosController = new MinerMarketInfosController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      this.minerMarketInfosController.getMinerMarketInfos
    );
    this.router.get(
      `${this.path}/:id`,
      this.minerMarketInfosController.getMinerMarketInfoById
    );
    this.router.post(
      `${this.path}`,
      validationMiddleware(CreateMinerMarketInfoDto, "body"),
      this.minerMarketInfosController.createMinerMarketInfo
    );
    this.router.put(
      `${this.path}/:id`,
      validationMiddleware(CreateMinerMarketInfoDto, "body", true),
      this.minerMarketInfosController.updateMinerMarketInfo
    );
    this.router.delete(
      `${this.path}/:id`,
      this.minerMarketInfosController.deleteMinerMarketInfo
    );
  }
}

export default MinerMarketInfosRoute;
