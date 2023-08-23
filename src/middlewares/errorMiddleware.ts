import { Request, Response, NextFunction } from "express";
import HttpException from "../common/exceptions/HttpException";
import { getResponseJson } from "../common/functions/getResponseJson";
import InternalServerException from "../common/exceptions/InternalServerException";
import { Prisma } from "@prisma/client";

function errorMiddleware(
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = error.status || 500;
  let message = error.message || "Internal server error!";

  if (process.env.NODE_ENV === "production") {
    console.log(error);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      message = "Related record not found!";
    } else {
      message = new InternalServerException().message;
    }
  } else if (!(error instanceof HttpException)) {
    message = new InternalServerException().message;
  }

  return res
    .status(statusCode)
    .json(getResponseJson(false, statusCode, error, message));
}

export default errorMiddleware;
