import compression from "compression";
import express from "express";
import morgan from "morgan";
import { connect, set } from "mongoose";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { NODE_ENV, PORT, LOG_FORMAT } from "@config";
import { dbConnection } from "@databases";
import { Routes } from "@interfaces/routes.interface";
import errorMiddleware from "@middlewares/error.middleware";
import { logger, stream } from "@utils/logger";
import Agenda from "agenda";
import { switchGoldshellPool } from "@poolswitch/goldshell-switcher";
import { switchAntminerPool } from "./poolswitch/antminer-switcher";
import poolSwitchScheduler from "./scheduler/pool-switch-scheduler";

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

    connect(dbConnection.url, dbConnection.options);
  }

  private async initiliazeSchedulers() {
    poolSwitchScheduler.startNewJobs([
      {
        minerId: "",
      },
    ]);
    // switchPool({
    //   ipAddress: "192.168.88.165",
    //   toClientPool: true,
    //   clientPool: {
    //     url: "stratum+tcp://kda.ss.poolmars.net:5200",
    //     user: "k:0907e28f36919517964993dfbb33fb53d421b0acc41d1c070a41ca0f84083c4b+pps.kdlite_1",
    //   },
    //   // clientPool: {
    //   //   url: "stratum+tcp://kda.ss.poolmars.net:5200",
    //   //   user: "k:03148fcea3fe47cb800fa66e869795fbaaa402c5f0e4437eb42ddbb613276be1+pps.kd2",
    //   // },
    // companyPool: {
    //   url: "stratum+tcp://kda.ss.poolmars.net:5200",
    //   user: "k:fd93de931359a2f15ba2aacdd9525e3783af0e975fe39195ba9f4cf6abeb8ff3+pps.kd6SE_1",
    // },
    //   macAddress: "",
    // });
    switchAntminerPool({
      ipAddress: "192.168.88.72",
      toClientPool: true,
      clientPool: {
        url: "stratum+tcp://us-east.stratum.slushpool.com:3333",
        user: "tywright",
      },
      macAddress: "3C:A3:08:74:81:87",
    });
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
