import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import {
  ICourseClassAssignmentCompletionController,
  ICourseClassAssignmentCompletionService,
} from "../completion.interface";
import {
  CourseClassAssignmentCompletionDITypes,
  CourseClassAssignmentCompletionResourceId,
} from "../completion.type";
import validateJoi from "../../../common/functions/validateJoi";
import { CreateCourseAssignmentCompletionDtoJoi } from "./completion.joi";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import isNaNArray from "../../../common/functions/isNaNArray";
import NaNException from "../../../common/class/exceptions/NaNException";
import { StatusCode } from "../../../common/constants/statusCode";

@injectable()
export default class CourseClassAssignmentCompletionController
  implements ICourseClassAssignmentCompletionController
{
  @inject(CourseClassAssignmentCompletionDITypes.SERVICE)
  private readonly service: ICourseClassAssignmentCompletionService;

  public async createCompletion(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateCourseAssignmentCompletionDtoJoi })(
        req,
        res,
        next,
      );

      const newCompletion = await this.service.createCompletion(
        getRequestUserOrThrowAuthenticationException(req),
        {
          resourceId: this.validateResourceId(req),
        },
        req.body,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({
        data: newCompletion,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteCompletion(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await this.service.deleteCompletion(
        getRequestUserOrThrowAuthenticationException(req),
        {
          completionId: this.validateCompletionId(req),
          resourceId: this.validateResourceId(req),
        },
      );

      res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(
    req: Request,
  ): CourseClassAssignmentCompletionResourceId {
    const courseId: number = Number(req.params.courseId);
    const classId: number = Number(req.params.classId);
    const assignmentId: number = Number(req.params);
    if (isNaNArray([courseId, classId, assignmentId])) {
      throw new NaNException("courseId || classId || assignmentId");
    }

    return {
      courseId,
      classId,
      assignmentId,
    };
  }

  private validateCompletionId(req: Request): number {
    const completionId: number = Number(req.params.completionId);
    if (isNaN(completionId)) {
      throw new NaNException("completionId");
    }
    return completionId;
  }
}
