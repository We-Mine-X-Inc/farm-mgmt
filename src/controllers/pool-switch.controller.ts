import { NextFunction, Request, Response } from "express";
import PoolSwitchScheduler from "@/scheduler/pool-switch-scheduler";

class PoolSwitchController {
  private poolSwitchScheduler = PoolSwitchScheduler.get();

  public startPoolSwitching = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const miningContracts = req.body;
      res.status(200);
    } catch (error) {
      next(error);
    }
  };
}

export default PoolSwitchController;
