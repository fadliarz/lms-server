import { inject, injectable } from "inversify";
import {
  CourseClassAssignmentDITypes,
  CourseClassAssignmentResourceId,
} from "../assignment.type";
import {
  ICourseClassAssignmentController,
  ICourseClassAssignmentService,
} from "../assignment.interface";
import { NextFunction, Request, Response } from "express";
import validateJoi from "../../../common/functions/validateJoi";
import { StatusCode } from "../../../common/constants/statusCode";
import isNaNArray from "../../../common/functions/isNaNArray";
import NaNException from "../../../common/class/exceptions/NaNException";
import {
  CreateCourseClassAssignmentDtoJoi,
  GetCourseClassAssignmentsQueryJoi,
  UpdateCourseClassAssignmentDtoJoi,
} from "./assignment.joi";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import getPagingQuery from "../../../common/functions/getPagingQuery";

@injectable()
export default class CourseClassAssignmentController
  implements ICourseClassAssignmentController
{
  @inject(CourseClassAssignmentDITypes.SERVICE)
  private readonly service: ICourseClassAssignmentService;

  public async createAssignment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateCourseClassAssignmentDtoJoi })(
        req,
        res,
        next,
      );

      const newAssignment = await this.service.createAssignment(
        getRequestUserOrThrowAuthenticationException(req),
        { resourceId: this.validateResourceId(req) },
        req.body,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({
        data: newAssignment,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getAssignments(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ query: GetCourseClassAssignmentsQueryJoi })(
        req,
        res,
        next,
      );

      const assignments = await this.service.getAssignments(
        getRequestUserOrThrowAuthenticationException(req),
        { resourceId: this.validateResourceId(req) },
        getPagingQuery(req.query),
      );

      return res.status(StatusCode.SUCCESS).json({
        data: assignments,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getAssignmentById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const assignment = await this.service.getAssignmentById(
        getRequestUserOrThrowAuthenticationException(req),
        {
          assignmentId: this.validateAssignmentId(req),
          resourceId: this.validateResourceId(req),
        },
      );

      return res.status(StatusCode.SUCCESS).json({
        data: assignment,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateAssignment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateCourseClassAssignmentDtoJoi })(
        req,
        res,
        next,
      );

      const updatedAssignment = await this.service.updateAssignment(
        getRequestUserOrThrowAuthenticationException(req),
        {
          assignmentId: this.validateAssignmentId(req),
          resourceId: this.validateResourceId(req),
        },
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: updatedAssignment,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteAssignment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await this.service.deleteAssignment(
        getRequestUserOrThrowAuthenticationException(req),
        {
          assignmentId: this.validateAssignmentId(req),
          resourceId: this.validateResourceId(req),
        },
      );

      return res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(req: Request): CourseClassAssignmentResourceId {
    const courseId: number = Number(req.params.courseId);
    const classId: number = Number(req.params.classId);
    if (isNaNArray([courseId, classId])) {
      throw new NaNException("courseId || classId");
    }

    return {
      courseId,
      classId,
    };
  }

  private validateAssignmentId(req: Request): number {
    const assignmentId: number = Number(req.params.assignmentId);
    if (isNaN(assignmentId)) {
      throw new NaNException("assignmentId");
    }

    return assignmentId;
  }
}
