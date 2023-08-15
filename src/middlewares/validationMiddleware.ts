import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import HttpException from "../common/exceptions/HttpException";
import { StatusCode } from "../common/constants/statusCode";

export function validationMiddleware(obj: {
  body?: Joi.Schema;
  query?: Joi.Schema;
}) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const validationOptions = {
      abortEarly: false,
      allowUknown: false,
      stripUnkown: false,
    };

    try {
      if (obj.body) {
        await obj.body.validateAsync(req.body, validationOptions);
      }

      if (obj.query) {
        await obj.query.validateAsync(req.query, validationOptions);
      }

      next();
    } catch (error: any) {
      const errorsMessage: string[] = [];

      error.details.forEach((error: Joi.ValidationErrorItem) => {
        errorsMessage.push(error.message);
      });

      next(new HttpException(StatusCode.BAD_REQUEST, errorsMessage));
    }
  };
}
