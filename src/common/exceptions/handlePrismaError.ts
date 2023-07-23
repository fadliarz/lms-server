import { Prisma } from "@prisma/client";
import HttpException from "./HttpException";
import { StatusCode } from "../constants/statusCode";
import { InternalServerException } from "./InternalServerException";

export function handlePrismaError(error: any) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2015" || error.code === "P2025") {
      return new HttpException(StatusCode.BAD_REQUEST, "Record not found!");
    }
  }

  return new InternalServerException();
}
