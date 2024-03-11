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
import yaml from "yamljs";
import { Request, Response } from "express";
import path from "path";

class App {
  public readonly express: Application;
  private readonly port: number;

  /**
   *
   * @param Apis
   * @param port
   */
  constructor(Apis: Api[], port: number) {
    this.express = express();
    this.port = port;
    // this.httpsServer = http.createServer(
    //   {
    //     key: process.env.SSL_KEY,
    //     cert: process.env.SSL_CERT,
    //   },
    //   this.express,
    // );

    this.initialiseMiddlewares();
    this.initialiseApi(Apis);
    this.initialiseErrorHandling();
    this.setupSwagger(...Apis.map((api) => api.router));
  }

  /**
   * Swagger
   *
   */
  public setupSwagger(...args: Router[]) {
    const pathToSwaggerUi = require("swagger-ui-dist").absolutePath();
    this.express.use(express.static(pathToSwaggerUi));

    console.log(path.join(process.cwd(), "swagger.yaml"));

    this.express.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(yaml.load(path.join(process.cwd(), "swagger.yaml")), {
        customCssUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.7/swagger-ui.min.css",
      }),
    );
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
  }

  /**
   * Error Handling
   *
   */
  private initialiseErrorHandling(): void {
    this.express.use(errorMiddleware);
  }
}

export default App;
