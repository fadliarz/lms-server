import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import HttpException from "../class/exceptions/HttpException";
import { StatusCode } from "../constants/statusCode";
import { ErrorCode } from "../constants/errorCode";
import { ErrorMessage } from "../constants/errorMessage";

export default function validateJoi(obj: {
  body?: Joi.Schema;
  query?: Joi.Schema;
}) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    let errorMessage: string[] = [];
    const validationOptions = {
      abortEarly: false,
      allowUknown: false,
      stripUnkown: false,
    };

    try {
      if (obj.body) {
        await obj.body.validateAsync(req.body, validationOptions);
      }
    } catch (error: any) {
      error.details.forEach((error: Joi.ValidationErrorItem) => {
        errorMessage.push(error.message);
      });

      throw new HttpException(
        StatusCode.BAD_REQUEST,
        ErrorCode.INVALID_BODY,
        errorMessage || (ErrorMessage[ErrorCode.INVALID_BODY] as string),
        true
      );
    }

    try {
      if (obj.query) {
        await obj.query.validateAsync(req.query, validationOptions);
      }
    } catch (error: any) {
      error.details.forEach((error: Joi.ValidationErrorItem) => {
        errorMessage.push(error.message);
      });

      throw new HttpException(
        StatusCode.BAD_REQUEST,
        ErrorCode.INVALID_QUERY,
        errorMessage || ErrorMessage[ErrorCode.INVALID_QUERY],
        true
      );
    }
  };
}
