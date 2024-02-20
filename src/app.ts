import "reflect-metadata";
import express, { Application, Router } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/errorMiddleware";
import { Api } from "./common/types";
import swaggerUi from "swagger-ui-express";
import PrismaClientSingleton from "./common/class/PrismaClientSingleton";
import yaml from "yamljs";
import { Request, Response } from "express";
import https from "https";
import * as http from "http";

class App {
  public readonly express: Application;
  private readonly prisma = PrismaClientSingleton.getInstance();
  private readonly port: number;
  private readonly httpsServer: any;

  /**
   *
   * @param Apis
   * @param port
   */
  constructor(Apis: Api[], port: number) {
    this.express = express();
    this.port = port;
    // this.httpsServer = http.createServer(
    //   // {
    //   //   key: process.env.SSL_KEY,
    //   //   cert: process.env.SSL_CERT,
    //   // },
    //   this.express,
    // );

    this.initialiseMiddlewares();
    this.initialiseApi(Apis);
    this.initialiseErrorHandling();
    // this.setupSwagger(...Apis.map((api) => api.router));
    this.setup();
  }

  /**
   * Swagger
   *
   */
  public setupSwagger(...args: Router[]) {
    this.express.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(yaml.load("swagger.yaml")),
    );
  }

  /**
   * Listen to app to a port
   *
   */
  public listen(): void {
    let port =
      process.env.NODE_ENV == "test"
        ? Math.floor(Math.random() * 60000) + 5000
        : this.port;
    this.express.listen(port, () => {
      console.log("HTTPS server is listening on the port", port);
    });
  }

  /**
   * Middlewares
   *
   */
  private initialiseMiddlewares(): void {
    this.express.use(
      cors({
        origin: "http://localhost:4444",
        credentials: true, //access-control-allow-credentials:true
        optionsSuccessStatus: 200,
      }),
    );

    if (process.env.NODE_ENV === "development") {
      this.express.use(morgan("'dev"));
    }

    this.express.use(helmet());
    this.express.use(compression());
    this.express.use(cookieParser());

    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(compression());
  }

  /**
   *
   * @param Apis
   * @private
   */
  private initialiseApi(Apis: Api[]): void {
    Apis.forEach((api: Api) => {
      this.express.use(api.path, api.router);
    });

    this.express.use("/test", (req: Request, res: Response) => {
      return res.send("Success!");
    });
  }

  /**
   * Error Handling
   *
   */
  private initialiseErrorHandling(): void {
    this.express.use(errorMiddleware);
  }

  /**
   * Make database connection
   *
   */
  private async initialiseDatabaseConnection(): Promise<void> {
    try {
      await this.prisma.$connect();

      console.log("Successfully establishing database connection!");
    } catch (error) {
      console.error("error: ", error);

      throw Error("Failed establishing a database connection!");
    }
  }

  /**
   * Setup
   *
   */
  private async setup(): Promise<void> {
    try {
      console.log("Initialising database connection!");

      await this.initialiseDatabaseConnection();

      // this.listen();
    } catch (error) {
      console.error("error: ", error);

      throw Error("Failed setting up!");
    }
  }
}

export default App;
