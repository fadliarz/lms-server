import { NextFunction } from "express";
import HttpException from "./HttpException";
import { InternalServerException } from "./InternalServerException";

export function handleError(error: any, next: NextFunction) {
  if (!(error instanceof HttpException)) {
    next(new InternalServerException());
  }

  next(error);
}
