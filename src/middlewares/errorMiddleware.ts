import { Request, Response, NextFunction } from "express";
import HttpException from "../common/class/exceptions/HttpException";
import InternalServerException from "../common/class/exceptions/InternalServerException";
import { Prisma } from "@prisma/client";
import { StatusCode } from "../common/constants/statusCode";
import { ErrorCode } from "../common/constants/errorCode";
import { ErrorMessage } from "../common/constants/errorMessage";
import PrismaError from "../common/constants/prismaError";

function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode: number;
  let errorCode: string;
  let message: string;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = StatusCode.BAD_REQUEST;

    if ((PrismaError as any)[error.code] !== undefined) {
      const errorInformation = (PrismaError as any)[error.code];
      errorCode = errorInformation.errorCode;
      message = errorInformation.message;
    } else {
      errorCode = ErrorCode.BAD_REQUEST;
      message = ErrorMessage[ErrorCode.BAD_REQUEST] as string;
    }

    return res.status(statusCode).json({
      error: {
        errorCode,
        message,
      },
    });
  }

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
