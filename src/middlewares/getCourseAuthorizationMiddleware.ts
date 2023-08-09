import { PrismaClient, Role } from "@prisma/client";

import { NextFunction } from "express";
import { AuthorizationException } from "../common/exceptions/AuthorizationException";
import dIContainer from "../inversifyConfig";
import { databaseDITypes } from "../common/constants/databaseDITypes";

export const getCourseAuthorizationMiddleware = () => {
  return (role: Role | Role[]) => {
    return async (req: any, res: Response, next: NextFunction) => {
      try {
        const prisma = dIContainer.get<PrismaClient>(
          databaseDITypes.PRISMA_CLIENT
        );
        const courseEnrollmentTable = prisma.courseEnrollment;
        const enrollment = await courseEnrollmentTable.findUnique({
          where: {
            userId_courseId: {
              userId: req.user.id,
              courseId: req.params.courseId,
            },
          },
          select: {
            role: true,
          },
        });

        if (!enrollment) {
          throw new AuthorizationException();
        }

        const userRole = enrollment.role;

        if (Array.isArray(role)) {
          const roles = role.map((value) => value.toString());

          if (!roles.includes(userRole.toString())) {
            throw new AuthorizationException();
          }
        } else {
          const roles = [
            Role.STUDENT.toString(),
            Role.INSTRUCTOR.toString(),
            Role.OWNER.toString(),
          ];

          if (
            roles.indexOf(userRole.toString()) < roles.indexOf(role.toString())
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
