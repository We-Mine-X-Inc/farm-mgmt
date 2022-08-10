import { NextFunction, Request, Response } from "express";
import poolSwitchScheduler from "@/scheduler/pool-switch-scheduler";

class PoolSwitchController {
  public startPoolSwitching = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const miningContract = req.body;
      poolSwitchScheduler.startNewJobs(miningContract);
      res.status(200);
    } catch (error) {
      next(error);
    }
  };
}

export default PoolSwitchController;
