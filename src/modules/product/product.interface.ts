import { NextFunction, Request, Response } from "express";

export interface IProductController {
  createProduct: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getProducts: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getProductById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}
