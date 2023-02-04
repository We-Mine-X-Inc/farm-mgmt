import { NextFunction, Request, Response } from "express";
import { CreatePoolDto } from "@/dtos/pool.dto";
import { Pool } from "@/interfaces/pool.interface";
import PoolService from "@services/pool.service";
import { Types } from "mongoose";

/**
 * Controls request/response handling for Pool API calls. This class/object is the first
 * code to be reached after routing.
 */
class PoolsController {
  public poolService = new PoolService();

  public getPools = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllPoolsData: Pool[] = await this.poolService.findAllPools();

      res.status(200).json({ data: findAllPoolsData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getPoolById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const poolId: string = req.params.id;
      const findOnePoolData: Pool = await this.poolService.findPoolById(
        new Types.ObjectId(poolId)
      );

      res.status(200).json({ data: findOnePoolData, message: "findOne" });
    } catch (error) {
      next(error);
    }
  };

  public createPool = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const poolData: CreatePoolDto = req.body;
      const createPoolData: Pool = await this.poolService.createPool(poolData);

      res.status(201).json({ data: createPoolData, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  public deletePool = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const poolId: string = req.params.id;
      const deletePoolData: Pool = await this.poolService.deletePool(
        new Types.ObjectId(poolId)
      );

      res.status(200).json({ data: deletePoolData, message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}

export default PoolsController;
