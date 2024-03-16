import { Request, Response, NextFunction } from "express";
import HttpException from "../common/class/exceptions/HttpException";
import InternalServerException from "../common/class/exceptions/InternalServerException";

function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log("[@errorMiddleware error]: ", error);

  let statusCode: number;
  let errorCode: string;
  let message: string;

  if (!(error instanceof HttpException)) {
    error = new InternalServerException();
  }

  statusCode = (error as HttpException).status;
  message = (error as HttpException).message;
  errorCode = (error as HttpException).errorCode;

  return res.status(statusCode).json({
    error: {
      errorCode,
      message,
    },
  });
}

export default errorMiddleware;
