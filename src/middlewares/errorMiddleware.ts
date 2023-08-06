import { Request, Response, NextFunction, response } from "express";
import HttpException from "../common/exceptions/HttpException";
import { getResponseJson } from "../common/response/getResponseJson";

function errorMiddleware(
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = error.status;
  const message = error.message;

  console.log(message)

  res.status(statusCode).json(getResponseJson(false, statusCode, error, message));
}

export default errorMiddleware;
