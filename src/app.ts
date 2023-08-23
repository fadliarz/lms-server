import "reflect-metadata";
import express, { Application, NextFunction, Router } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/errorMiddleware";
import { Api } from "./common/types";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import PrismaClientSingleton from "./common/class/PrismaClientSingleton";

class App {
  private readonly prisma = PrismaClientSingleton.getInstance();
  public readonly express: Application;
  private readonly port: number;

  /**
   *
   * @param controllers
   * @param port
   */
  constructor(Apis: Api[], port: number) {
    this.express = express();
    this.port = port;

    this.initialiseDatabaseConnection();
    this.initialiseMiddlewares();
    this.initialiseApi(Apis);
    this.initialiseErrorHandling();
    this.setupSwagger(...Apis.map((api) => api.router));
    this.listen();
  }

  /**
   * Swagger
   */
  public setupSwagger(...args: Router[]) {
    const swaggerOptions = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "Learning Management System",
          version: "1.0.0",
          description: "API documentation",
        },
      },
      apis: ["./src/modules/*/router/*.router.ts"],
    };

    const swaggerSpec = swaggerJSDoc(swaggerOptions);
    this.express.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec)
    );
  }

  /**
   * Middlewares
   */
  private initialiseMiddlewares(): void {
    this.express.use(
      cors({
        origin: "http://localhost:4444",
        credentials: true, //access-control-allow-credentials:true
        optionsSuccessStatus: 200,
      })
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
   * @param controllers
   */
  private initialiseApi(Apis: Api[]): void {
    Apis.forEach((api: Api) => {
      this.express.use(api.path, api.router);
    });
  }

  /**
   * Error Handling
   */
  private initialiseErrorHandling(): void {
    this.express.use(errorMiddleware);
  }

  /**
   * Make database connection
   */
  private async initialiseDatabaseConnection(): Promise<void> {
    try {
      await this.prisma.$connect();
    } catch (error) {
      throw Error("Failed estabilishing a database connection!");
    }
  }

  /**
   * Listen to app to a port
   */
  public listen(): void {
    let port =
      process.env.NODE_ENV == "test"
        ? Math.floor(Math.random() * 60000) + 5000
        : this.port;
    this.express.listen(port, () => {
      console.log("App is listening on port ", port);
    });
  }
}

export default App;
