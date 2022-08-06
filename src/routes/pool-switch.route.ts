import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import { MinerSwitchPoolContractDto } from "@/dtos/pool-switch.dto";
import PoolSwitchController from "@/controllers/pool-switch.controller";

class PoolSwitchRoute implements Routes {
  public path = "/pool-switch";
  public router = Router();
  public poolSwitchController = new PoolSwitchController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/start`,
      validationMiddleware(Array<MinerSwitchPoolContractDto>, "body"),
      this.poolSwitchController.startPoolSwitching
    );
  }
}

export default PoolSwitchRoute;
