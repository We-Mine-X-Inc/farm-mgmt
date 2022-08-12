import compression from "compression";
import express from "express";
import morgan from "morgan";
import { connect, set, Types } from "mongoose";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { NODE_ENV, PORT, LOG_FORMAT } from "@config";
import { dbConnection } from "@databases";
import { Routes } from "@interfaces/routes.interface";
import errorMiddleware from "@middlewares/error.middleware";
import { logger, stream } from "@utils/logger";
import poolSwitchScheduler from "./scheduler/pool-switch-scheduler";
import serverUptimeScheduler from "./scheduler/server-uptime-scheduler";
import minerStatusScheduler from "./scheduler/miner-status-scheduler";

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || "development";
    this.port = PORT || 3000;

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
      set("debug", true);
    }

    connect(dbConnection.url);
  }

  private async initiliazeSchedulers() {
    await poolSwitchScheduler.resumeServerInterruptedJobs();
    await serverUptimeScheduler.startJobs();
    await minerStatusScheduler.startJobs();
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
