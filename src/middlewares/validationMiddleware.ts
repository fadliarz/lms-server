import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import HttpException from "../common/class/exceptions/HttpException";
import { StatusCode } from "../common/constants/statusCode";
import { ErrorCode } from "../common/constants/errorCode";
import { ErrorMessage } from "../common/constants/errorMessage";

export function validationMiddleware(obj: {
  body?: Joi.Schema;
  query?: Joi.Schema;
}) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let errorMessage: string[] = [];
    const validationOptions = {
      abortEarly: false,
      allowUknown: false,
      stripUnkown: false,
    };

    if (obj.body) {
      try {
        await obj.body.validateAsync(req.body, validationOptions);
      } catch (error: any) {
        error.details.forEach((error: Joi.ValidationErrorItem) => {
          errorMessage.push(error.message);
        });

        next(
          new HttpException(
            StatusCode.BAD_REQUEST,
            ErrorCode.INVALID_BODY,
            errorMessage || (ErrorMessage[ErrorCode.INVALID_BODY] as string),
            true,
          ),
        );

        return;
      }
    }

    if (obj.query) {
      try {
        await obj.query.validateAsync(req.query, validationOptions);
      } catch (error: any) {
        error.details.forEach((error: Joi.ValidationErrorItem) => {
          errorMessage.push(error.message);
        });

        next(
          new HttpException(
            StatusCode.BAD_REQUEST,
            ErrorCode.INVALID_QUERY,
            errorMessage || ErrorMessage[ErrorCode.INVALID_QUERY],
            true,
          ),
        );

        return;
      }
    }

    next();
  };
}
