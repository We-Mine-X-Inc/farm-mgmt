import { Router } from "express";
import MgmtAccountsController from "@/controllers/mgmt-account.controller";
import { CreateMgmtAccountDto } from "@/dtos/mgmt-account.dto";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";

class MgmtAccountsRoute implements Routes {
  public path = "/mgmtAccounts";
  public router = Router();
  public mgmtAccountsController = new MgmtAccountsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      this.mgmtAccountsController.getMgmtAccounts
    );
    this.router.get(
      `${this.path}/:id`,
      this.mgmtAccountsController.getMgmtAccountById
    );
    this.router.post(
      `${this.path}`,
      validationMiddleware(CreateMgmtAccountDto, "body"),
      this.mgmtAccountsController.createMgmtAccount
    );
    this.router.put(
      `${this.path}/:id`,
      validationMiddleware(CreateMgmtAccountDto, "body", true),
      this.mgmtAccountsController.updateMgmtAccount
    );
    this.router.delete(
      `${this.path}/:id`,
      this.mgmtAccountsController.deleteMgmtAccount
    );
  }
}

export default MgmtAccountsRoute;
