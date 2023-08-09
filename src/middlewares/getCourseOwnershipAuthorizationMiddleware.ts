import { Request, Response, NextFunction } from "express";
import dIContainer from "../inversifyConfig";
import { PrismaClient } from "@prisma/client";
import { databaseDITypes } from "../common/constants/databaseDITypes";
import { getRequestUserOrThrowAuthenticationException } from "../common/functions/getRequestUserOrThrowAuthenticationException";
import { AuthorizationException } from "../common/exceptions/AuthorizationException";

export function getCourseOwnershipAuthorizationMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);
      const prisma = dIContainer.get<PrismaClient>(
        databaseDITypes.PRISMA_CLIENT
      );

      const { authorId } = await prisma.course.findUniqueOrThrow({
        where: { id: req.params.courseId },
        select: {
          authorId: true,
        },
      });

      if (authorId !== user.id) {
        throw new AuthorizationException();
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
