import { NextFunction, Request, Response } from "express";
import { CreateCoinMarketInfoDto } from "@/dtos/coin-market-info.dto";
import { CoinMarketInfo } from "@/interfaces/coin-market-info.interface";
import CoinMarketInfoService from "@services/coin-market-info.service";
import { Types } from "mongoose";

/**
 * Controls request/response handling for CoinMarketInfo API calls. This class/object is the first
 * code to be reached after routing.
 */
class CoinMarketInfosController {
  public coinMarketInfoService = new CoinMarketInfoService();

  public getCoinMarketInfos = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const findAllCoinMarketInfosData: CoinMarketInfo[] =
        await this.coinMarketInfoService.findAllCoinMarketInfos();

      res
        .status(200)
        .json({ data: findAllCoinMarketInfosData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getCoinMarketInfoById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const coinMarketInfoId: string = req.params.id;
      const findOneCoinMarketInfoData: CoinMarketInfo =
        await this.coinMarketInfoService.findCoinMarketInfoById(
          new Types.ObjectId(coinMarketInfoId)
        );

      res
        .status(200)
        .json({ data: findOneCoinMarketInfoData, message: "findOne" });
    } catch (error) {
      next(error);
    }
  };

  public createCoinMarketInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const coinMarketInfoData: CreateCoinMarketInfoDto = req.body;
      const createCoinMarketInfoData: CoinMarketInfo =
        await this.coinMarketInfoService.createCoinMarketInfo(
          coinMarketInfoData
        );

      res
        .status(201)
        .json({ data: createCoinMarketInfoData, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  public updateCoinMarketInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const coinMarketInfoId: string = req.params.id;
      const coinMarketInfoData: CreateCoinMarketInfoDto = req.body;
      const updateCoinMarketInfoData: CoinMarketInfo =
        await this.coinMarketInfoService.updateCoinMarketInfo(
          new Types.ObjectId(coinMarketInfoId),
          coinMarketInfoData
        );

      res
        .status(200)
        .json({ data: updateCoinMarketInfoData, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  public deleteCoinMarketInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const coinMarketInfoId: string = req.params.id;
      const deleteCoinMarketInfoData: CoinMarketInfo =
        await this.coinMarketInfoService.deleteCoinMarketInfo(
          new Types.ObjectId(coinMarketInfoId)
        );

      res
        .status(200)
        .json({ data: deleteCoinMarketInfoData, message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}

export default CoinMarketInfosController;
