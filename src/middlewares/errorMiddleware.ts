import { Request, Response, NextFunction } from "express";
import HttpException from "../common/exceptions/HttpException";
import { getResponseJson } from "../common/functions/getResponseJson";
import InternalServerException from "../common/exceptions/InternalServerException";
import { Prisma } from "@prisma/client";
import { StatusCode } from "../common/constants/statusCode";

function errorMiddleware(
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = error.status || 500;
  let message = error.message || "Internal server error!";

  console.log(error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      message = "Related record not found!";
      statusCode = StatusCode.NOT_FOUND;
    } else if (error.code === "P2002") {
      message = "Related record already existed";
      statusCode = StatusCode.BAD_REQUEST;
    } else {
      message = "Client side exception!";
      statusCode = StatusCode.BAD_REQUEST;
    }
  } else if (!(error instanceof HttpException)) {
    message = new InternalServerException().message;
    statusCode = StatusCode.SERVER_ERROR;
  }

  return res
    .status(statusCode)
    .json(getResponseJson(false, statusCode, error, message));
}

export default errorMiddleware;
