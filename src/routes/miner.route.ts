import { Router } from "express";
import MinersController from "@/controllers/miner.controller";
import { CreateMinerDto } from "@/dtos/miner.dto";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";

class MinersRoute implements Routes {
  public path = "/miners";
  public router = Router();
  public minersController = new MinersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.minersController.getMiners);
    this.router.get(`${this.path}/:id`, this.minersController.getMinerById);
    this.router.post(
      `${this.path}`,
      validationMiddleware(CreateMinerDto, "body"),
      this.minersController.createMiner
    );
    this.router.put(
      `${this.path}/:id`,
      validationMiddleware(CreateMinerDto, "body", true),
      this.minersController.updateMiner
    );
    this.router.delete(`${this.path}/:id`, this.minersController.deleteMiner);
  }
}

export default MinersRoute;
