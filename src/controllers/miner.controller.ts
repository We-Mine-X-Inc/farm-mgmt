import { NextFunction, Request, Response } from "express";
import { CreateMinerDto } from "@/dtos/miner.dto";
import { Miner } from "@/interfaces/miner.interface";
import MinerService from "@services/miner.service";
import { Types } from "mongoose";
import { format as prettyFormat } from "pretty-format";

/**
 * Controls request/response handling for Miner API calls. This class/object is the first
 * code to be reached after routing.
 */
class MinersController {
  public minerService = new MinerService();

  public getMiners = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const findAllMinersData: Miner[] =
        await this.minerService.findAllMiners();

      res.send({ data: findAllMinersData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getMinerById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const minerId: string = req.params.id;
      const findOneMinerData: Miner = await this.minerService.findMinerById(
        new Types.ObjectId(minerId)
      );

      res.send(`<pre>${prettyFormat(findOneMinerData)}</pre>`);
    } catch (error) {
      next(error);
    }
  };

  public createMiner = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const minerData: CreateMinerDto = req.body;
      const createMinerData: Miner = await this.minerService.createMiner(
        minerData
      );

      res.status(201).json({ data: createMinerData, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  public updateMiner = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const minerId: string = req.params.id;
      const minerData: CreateMinerDto = req.body;
      const updateMinerData: Miner = await this.minerService.updateMiner(
        new Types.ObjectId(minerId),
        minerData
      );

      res.status(200).json({ data: updateMinerData, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  public deleteMiner = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const minerId: string = req.params.id;
      const deleteMinerData: Miner = await this.minerService.deleteMiner(
        new Types.ObjectId(minerId)
      );

      res.status(200).json({ data: deleteMinerData, message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}

export default MinersController;
