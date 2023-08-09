import { Role } from "@prisma/client";

import { NextFunction } from "express";
import { AuthorizationException } from "../common/exceptions/AuthorizationException";

export const getUserAuthorizationMiddleware = () => {
  return (role: Role | Role[]) => {
    return async (req: any, res: Response, next: NextFunction) => {
      try {
        const user = req.user;

        if (Array.isArray(role)) {
          const roles = role.map((value) => value.toString());

          if (!roles.includes(user.role.toString())) {
            throw new AuthorizationException();
          }
        } else {
          const roles = [
            Role.STUDENT.toString(),
            Role.INSTRUCTOR.toString(),
            Role.OWNER.toString(),
          ];

          if (
            roles.indexOf(user.role.toString()) < roles.indexOf(role.toString())
          ) {
            throw new AuthorizationException();
          }
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  };
};
