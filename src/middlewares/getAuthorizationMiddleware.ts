import { Role } from "@prisma/client";

import { NextFunction } from "express";
import { AuthorizationException } from "../common/exceptions/AuthorizationException";

export const getAuthorizationMiddleware = () => {
  return (enumRoles: Role[]) => {
    const roles = enumRoles.map((role) => role.toString());

    return async (req: any, res: Response, next: NextFunction) => {
      try {
        const user = req.user;

        if (!roles.includes(user.role.toString())) {
          throw new AuthorizationException();
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  };
};
