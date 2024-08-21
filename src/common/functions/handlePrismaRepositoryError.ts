import { Prisma } from "@prisma/client";
import { PrismaErrorCode } from "../constants/prismaError";
import HttpException from "../class/exceptions/HttpException";
import { StatusCode } from "../constants/statusCode";
import { ErrorCode } from "../constants/errorCode";
import InternalServerException from "../class/exceptions/InternalServerException";
import { DatabaseOperationConstraint } from "./handleRepositoryError";
import RecordNotFoundException from "../class/exceptions/RecordNotFoundException";

export default function handlePrismaRepositoryError(
  error: Error,
  constraint?: DatabaseOperationConstraint,
): Error {
  console.log("[@handlePrismaRepositoryError error]: ", error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    /**
     * template: "Foreign key constraint failed on the field: {field_name}"
     *
     */
    if (error.code === PrismaErrorCode.FOREIGN_KEY_CONSTRAINT) {
      const defaultError = new HttpException(
        StatusCode.BAD_REQUEST,
        ErrorCode.FOREIGN_KEY_CONSTRAINT,
        error.message,
      );

      if (!constraint) {
        return defaultError;
      }

      if (!constraint.foreignConstraint) {
        return defaultError;
      }

      const field = error.message.split("field: ")[1];
      const foreignConstraint = constraint.foreignConstraint;

      if (foreignConstraint.hasOwnProperty(field)) {
        return new HttpException(
          StatusCode.BAD_REQUEST,
          ErrorCode.FOREIGN_KEY_CONSTRAINT,
          foreignConstraint[field].message,
        );
      }

      if (foreignConstraint.default) {
        return new HttpException(
          StatusCode.BAD_REQUEST,
          ErrorCode.FOREIGN_KEY_CONSTRAINT,
          foreignConstraint.default.message,
        );
      }

      return defaultError;
    }

    /**
     * template: "Unique constraint failed on the {constraint}"
     *
     */
    if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT) {
      const defaultError = new HttpException(
        StatusCode.BAD_REQUEST,
        ErrorCode.UNIQUE_CONSTRAINT,
        error.message,
      );

      if (!constraint) {
        return defaultError;
      }

      if (!constraint.uniqueConstraint) {
        return defaultError;
      }

      const field = (error.meta?.target as Array<string>).join("&");
      const uniqueConstraint = constraint.uniqueConstraint;

      if (uniqueConstraint.hasOwnProperty(field)) {
        return new HttpException(
          StatusCode.BAD_REQUEST,
          ErrorCode.UNIQUE_CONSTRAINT,
          uniqueConstraint[field].message,
        );
      }

      if (uniqueConstraint.default) {
        return new HttpException(
          StatusCode.BAD_REQUEST,
          ErrorCode.UNIQUE_CONSTRAINT,
          uniqueConstraint.default.message,
        );
      }

      return defaultError;
    }

    if (error.code === PrismaErrorCode.RECORD_NOT_FOUND) {
      return new RecordNotFoundException();
    }
  }

  if (error instanceof HttpException) {
    return error;
  }

  return new InternalServerException();
}
