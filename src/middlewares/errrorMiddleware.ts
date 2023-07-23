import { Request, Response, NextFunction, response } from "express";
import HttpException from "../common/exceptions/HttpException";

function errorMiddleware(
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = error.statusCode;
  const message = error.customMessage;

  res.status(statusCode).json({
    statusCode,
    message,
  });
}

export default errorMiddleware;
