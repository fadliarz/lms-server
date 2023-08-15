import { Request, Response, NextFunction } from "express";
import HttpException from "../common/exceptions/HttpException";
import { getResponseJson } from "../common/response/getResponseJson";
import { InternalServerException } from "../common/exceptions/InternalServerException";

function errorMiddleware(
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = error.status;
  const message = error.message;

  if (!(error instanceof HttpException)) {
    error = new InternalServerException();
  }

  return res
    .status(statusCode)
    .json(getResponseJson(false, statusCode, error, message));
}

export default errorMiddleware;
