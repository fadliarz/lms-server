import { Prisma } from "@prisma/client";
import { PrismaErrorCode } from "../constants/prismaError";
import HttpException from "../class/exceptions/HttpException";
import { StatusCode } from "../constants/statusCode";
import { ErrorCode } from "../constants/errorCode";
import InternalServerException from "../class/exceptions/InternalServerException";
import { DatabaseOperationConstraint } from "./handleRepositoryError";

export default function handlePrismaRepositoryError(
  error: Error,
  constraint: DatabaseOperationConstraint,
): Error {
  console.log("[@handlePrismaRepositoryError error]: ", error);

  if (error instanceof HttpException) {
    return error;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.log("[@handlePrismaRepositoryError PrismaError]: ", error);

    if (error.code === PrismaErrorCode.FOREIGN_KEY_CONSTRAINT) {
      // template: "Foreign key constraint failed on the field: {field_name}"
      const field = error.message.split("field: ")[1];
      const foreignConstraint = constraint.foreignConstraint;

      if (foreignConstraint && foreignConstraint.hasOwnProperty(field)) {
        return new HttpException(
          StatusCode.BAD_REQUEST,
          ErrorCode.FOREIGN_KEY_CONSTRAINT,
          foreignConstraint[field].message,
        );
      }

      if (foreignConstraint && foreignConstraint.default) {
        return new HttpException(
          StatusCode.BAD_REQUEST,
          ErrorCode.FOREIGN_KEY_CONSTRAINT,
          foreignConstraint.default.message,
        );
      }
    }

    if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT) {
      // template: "Unique constraint failed on the {constraint}"
      const field = (error.meta?.target as Array<string>).join("&");
      const uniqueConstraint = constraint.uniqueConstraint;

      if (uniqueConstraint && uniqueConstraint.hasOwnProperty(field)) {
        return new HttpException(
          StatusCode.BAD_REQUEST,
          ErrorCode.UNIQUE_CONSTRAINT,
          uniqueConstraint[field].message,
        );
      }

      if (uniqueConstraint && uniqueConstraint.default) {
        return new HttpException(
          StatusCode.BAD_REQUEST,
          ErrorCode.UNIQUE_CONSTRAINT,
          uniqueConstraint.default.message,
        );
      }
    }
  }

  return new InternalServerException();
}
