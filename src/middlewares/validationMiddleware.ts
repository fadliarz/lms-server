import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import HttpException from "../common/exceptions/HttpException";
import { StatusCode } from "../common/constants/statusCode";

export function validationMiddleware(schema: Joi.Schema) {
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
      const validation = await schema.validateAsync(
        req.body,
        validationOptions
      );

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
