import { NextFunction, Request, Response } from "express";
import {
  MinerPerformanceRequestDto,
  MinerPerformanceResponseDto,
} from "@/dtos/miner-performance.dto";
import { MinerPerformance } from "@/interfaces/miner-performance.interface";
import MinerPerformanceService from "@services/miner-performance.service";
import { Types } from "mongoose";

/**
 * Controls request/response handling for MinerPerformance API calls. This class/object is the first
 * code to be reached after routing.
 */
class MinerPerformancesController {
  public minerPerformanceService = new MinerPerformanceService();

  public getHashRatePerfForMiner = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const minerData: MinerPerformanceRequestDto = req.body;
      const findAllMinerPerformancesData: MinerPerformanceResponseDto =
        await this.minerPerformanceService.getHashRateForMiner({
          minerId: minerData.minerId,
          timeRange: minerData.timeRange,
        });

      res.status(200).json({
        data: findAllMinerPerformancesData,
        message: "getHashRatePerfForMiner",
      });
    } catch (error) {
      next(error);
    }
  };
}

export default MinerPerformancesController;
