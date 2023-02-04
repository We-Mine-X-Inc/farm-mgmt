import { NextFunction, Request, Response } from "express";
import { CreateMinerMarketInfoDto } from "@/dtos/miner-market-info.dto";
import { MinerMarketInfo } from "@/interfaces/miner-market-info.interface";
import MinerMarketInfoService from "@services/miner-market-info.service";
import { Types } from "mongoose";

/**
 * Controls request/response handling for MinerMarketInfo API calls. This class/object is the first
 * code to be reached after routing.
 */
class MinerMarketInfosController {
  public minerMarketInfoService = new MinerMarketInfoService();

  public getMinerMarketInfos = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const findAllMinerMarketInfosData: MinerMarketInfo[] =
        await this.minerMarketInfoService.findAllMinerMarketInfos();

      res
        .status(200)
        .json({ data: findAllMinerMarketInfosData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getMinerMarketInfoById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const minerMarketInfoId: string = req.params.id;
      const findOneMinerMarketInfoData: MinerMarketInfo =
        await this.minerMarketInfoService.findMinerMarketInfoById(
          new Types.ObjectId(minerMarketInfoId)
        );

      res
        .status(200)
        .json({ data: findOneMinerMarketInfoData, message: "findOne" });
    } catch (error) {
      next(error);
    }
  };

  public createMinerMarketInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const minerMarketInfoData: CreateMinerMarketInfoDto = req.body;
      const createMinerMarketInfoData: MinerMarketInfo =
        await this.minerMarketInfoService.createMinerMarketInfo(
          minerMarketInfoData
        );

      res
        .status(201)
        .json({ data: createMinerMarketInfoData, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  public updateMinerMarketInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const minerMarketInfoId: string = req.params.id;
      const minerMarketInfoData: CreateMinerMarketInfoDto = req.body;
      const updateMinerMarketInfoData: MinerMarketInfo =
        await this.minerMarketInfoService.updateMinerMarketInfo(
          new Types.ObjectId(minerMarketInfoId),
          minerMarketInfoData
        );

      res
        .status(200)
        .json({ data: updateMinerMarketInfoData, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  public deleteMinerMarketInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const minerMarketInfoId: string = req.params.id;
      const deleteMinerMarketInfoData: MinerMarketInfo =
        await this.minerMarketInfoService.deleteMinerMarketInfo(
          new Types.ObjectId(minerMarketInfoId)
        );

      res
        .status(200)
        .json({ data: deleteMinerMarketInfoData, message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}

export default MinerMarketInfosController;
