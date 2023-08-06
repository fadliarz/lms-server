import "reflect-metadata";
import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/errorMiddleware";
import { Api } from "./common/types";

class App {
  private _express: Application;
  private _port: number;

  /**
   *
   * @param controllers
   * @param port
   */
  constructor(Apis: Api[], port: number) {
    this._express = express();
    this._port = port;

    this.initialiseMiddlewares();
    this.initialiseApi(Apis);
    this.initialiseErrorHandling();
    this.initialiseDatabaseConnection();
  }

  /**
   * Middlewares
   */
  private initialiseMiddlewares(): void {
    this._express.use(
      cors({
        origin: "http://localhost:4444",
        credentials: true, //access-control-allow-credentials:true
        optionsSuccessStatus: 200,
      })
    );
    this._express.use(morgan('"dev'));
    this._express.use(helmet());
    this._express.use(compression());
    this._express.use(cookieParser());

    this._express.use(express.json());
    this._express.use(express.urlencoded({ extended: true }));
    this._express.use(compression());
  }

  /**
   *
   * @param controllers
   */
  private initialiseApi(Apis: Api[]): void {
    Apis.forEach((api: Api) => {
      this._express.use(api.path, api.router);
    });
  }

  /**
   * Error Handling
   */
  private initialiseErrorHandling(): void {
    this._express.use(errorMiddleware);
  }

  /**
   * Make database connection
   */
  private initialiseDatabaseConnection(): void { }

  /**
   * Listen to app to a port
   */
  public listen(): void {
    this._express.listen(this._port, () => {
      console.log("App is listening on port ", this._port);
    });
  }
}

export default App;
