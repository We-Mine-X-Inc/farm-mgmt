import { NextFunction, Request, Response } from "express";
import { CreateMgmtAccountDto } from "@/dtos/mgmt-account.dto";
import { MgmtAccount } from "@/interfaces/mgmt-account.interface";
import MgmtAccountService from "@services/mgmt-account.service";
import { Types } from "mongoose";

/**
 * Controls request/response handling for MgmtAccount API calls. This class/object is the first
 * code to be reached after routing.
 */
class MgmtAccountsController {
  public mgmtAccountService = new MgmtAccountService();

  public getMgmtAccounts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const findAllMgmtAccountsData: MgmtAccount[] =
        await this.mgmtAccountService.findAllMgmtAccount();

      res
        .status(200)
        .json({ data: findAllMgmtAccountsData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getMgmtAccountById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const mgmtAccountId: string = req.params.id;
      const findOneMgmtAccountData: MgmtAccount =
        await this.mgmtAccountService.findMgmtAccountById(
          new Types.ObjectId(mgmtAccountId)
        );

      res
        .status(200)
        .json({ data: findOneMgmtAccountData, message: "findOne" });
    } catch (error) {
      next(error);
    }
  };

  public createMgmtAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const mgmtAccountData: CreateMgmtAccountDto = req.body;
      const createMgmtAccountData: MgmtAccount =
        await this.mgmtAccountService.createMgmtAccount(mgmtAccountData);

      res.status(201).json({ data: createMgmtAccountData, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  public updateMgmtAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const mgmtAccountId: string = req.params.id;
      const mgmtAccountData: CreateMgmtAccountDto = req.body;
      const updateMgmtAccountData: MgmtAccount =
        await this.mgmtAccountService.updateMgmtAccount(
          new Types.ObjectId(mgmtAccountId),
          mgmtAccountData
        );

      res.status(200).json({ data: updateMgmtAccountData, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  public deleteMgmtAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const mgmtAccountId: string = req.params.id;
      const deleteMgmtAccountData: MgmtAccount =
        await this.mgmtAccountService.deleteMgmtAccount(
          new Types.ObjectId(mgmtAccountId)
        );

      res.status(200).json({ data: deleteMgmtAccountData, message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}

export default MgmtAccountsController;
