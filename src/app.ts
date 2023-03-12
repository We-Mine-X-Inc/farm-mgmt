import compression from "compression";
import express from "express";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { NODE_ENV, PORT, LOG_FORMAT } from "@config";
import { dbConnection } from "@databases";
import { Routes } from "@interfaces/routes.interface";
import errorMiddleware from "@middlewares/error.middleware";
import { logger, stream } from "@utils/logger";
import PoolSwitchScheduler from "./scheduler/pool-switch-scheduler";
import ServerUptimeScheduler from "./scheduler/server-uptime-scheduler";
import MinerStatusScheduler from "./scheduler/miner-status-scheduler";
import PoolPerformanceScheduler from "./scheduler/pool-performance-scheduler";
import MonitoringUptimeScheduler from "./scheduler/monitoring-uptime-scheduler";
import MinerPerformanceService from "./services/miner-performance.service";
import { Types } from "mongoose";
import { format as prettyFormat } from "pretty-format";
import { ONE_HOUR_IN_MILLIS } from "./constants/time";

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  private minerPerformanceService = new MinerPerformanceService();

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || "development";
    this.port = PORT || 5000;

    this.connectToDatabase();
    this.initiliazeSchedulers();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    if (this.env !== "production") {
      dbConnection.set("debug", true);
    }

    dbConnection.connect();
  }

  private async initiliazeSchedulers() {
    if (this.env == "test") {
      return;
    }

    // await PoolSwitchScheduler.get().startScheduler();
    // await ServerUptimeScheduler.get().startScheduler();
    await MinerStatusScheduler.get().startScheduler();
    // await PoolPerformanceScheduler.get().startScheduler();
    // await MonitoringUptimeScheduler.get().startScheduler();

    // const earnings = await this.minerPerformanceService.getEarningsForMiner({
    //   minerId: new Types.ObjectId("63dad12d44fcb774c8dac641"),
    //   timeRange: {
    //     startInMillis: 1678111200000,
    //     endInMillis: 1678111200000 + ONE_HOUR_IN_MILLIS,
    //   },
    // });

    // console.log(prettyFormat("earnings"));
    // console.log(prettyFormat(earnings));
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: "REST API",
          version: "1.0.0",
          description:
            "Internal API - Manages Users, Miners, Pools and Pool Switching",
        },
      },
      apis: ["swagger.yaml"],
    };

    const specs = swaggerJSDoc(options);
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
