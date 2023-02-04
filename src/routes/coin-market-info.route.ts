import { Router } from "express";
import CoinMarketInfosController from "@/controllers/coin-market-info.controller";
import { CreateCoinMarketInfoDto } from "@/dtos/coin-market-info.dto";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";

class CoinMarketInfosRoute implements Routes {
  public path = "/mgmtAccounts";
  public router = Router();
  public mgmtAccountsController = new CoinMarketInfosController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      this.mgmtAccountsController.getCoinMarketInfos
    );
    this.router.get(
      `${this.path}/:id`,
      this.mgmtAccountsController.getCoinMarketInfoById
    );
    this.router.post(
      `${this.path}`,
      validationMiddleware(CreateCoinMarketInfoDto, "body"),
      this.mgmtAccountsController.createCoinMarketInfo
    );
    this.router.put(
      `${this.path}/:id`,
      validationMiddleware(CreateCoinMarketInfoDto, "body", true),
      this.mgmtAccountsController.updateCoinMarketInfo
    );
    this.router.delete(
      `${this.path}/:id`,
      this.mgmtAccountsController.deleteCoinMarketInfo
    );
  }
}

export default CoinMarketInfosRoute;
