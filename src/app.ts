import compression from "compression";
import express from "express";
import morgan from "morgan";
import { connect, isValidObjectId, set, Types } from "mongoose";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { NODE_ENV, PORT, LOG_FORMAT } from "@config";
import { dbConnection } from "@databases";
import { Routes } from "@interfaces/routes.interface";
import errorMiddleware from "@middlewares/error.middleware";
import { logger, stream } from "@utils/logger";
import poolSwitchScheduler from "./scheduler/pool-switch-scheduler";
import serverUptimeScheduler from "./scheduler/server-uptime-scheduler";
import ping from "ping";
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
    // await poolSwitchScheduler.startNewJobs([
    //   {
    //     minerId: "62ecae90c21e972c729114ce",
    //     clientMillis: 46800000,
    //     companyMillis: 39600000,
    //     totalContractMillis: 17082000000,
    //   },
    // ]);

    // await poolSwitchScheduler.startNewJobs([
    //   {
    //     minerId: "62ed25b00f9cf6bb58b7dfe9",
    //     clientMillis: 46800000,
    //     companyMillis: 39600000,
    //     totalContractMillis: 17082000000,
    //   },
    // ]);

    // await poolSwitchScheduler.startNewJobs([
    //   {
    //     minerId: "62ed25b00f9cf6bb58b7dfea",
    //     clientMillis: 46800000,
    //     companyMillis: 39600000,
    //     totalContractMillis: 17082000000,
    //   },
    // ]);

    // await poolSwitchScheduler.startNewJobs([
    //   {
    //     minerId: "62ed25b00f9cf6bb58b7dfeb",
    //     clientMillis: 46800000,
    //     companyMillis: 39600000,
    //     totalContractMillis: 17082000000,
    //   },
    // ]);

    await poolSwitchScheduler.startNewJobs([
      {
        minerId: "62ed25b00f9cf6bb58b7dfec",
        clientMillis: 54000000,
        companyMillis: 32400000,
        totalContractMillis: 19710000000,
      },
    ]);

    await poolSwitchScheduler.startNewJobs([
      {
        minerId: "62ed25b00f9cf6bb58b7dfed",
        clientMillis: 54000000,
        companyMillis: 32400000,
        totalContractMillis: 19710000000,
      },
    ]);

    // await poolSwitchScheduler.startNewJobs([
    //   {
    //     minerId: "62ed25b00f9cf6bb58b7dfee",
    //     clientMillis: 57600000,
    //     companyMillis: 28800000,
    //     totalContractMillis: 21024000000,
    //   },
    // ]);
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
          description: "Internal API - Manages Users and Pool Switching",
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
