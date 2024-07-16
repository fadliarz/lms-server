import { inject, injectable } from "inversify";
import {
  CourseClassAssignmentDITypes,
  CourseClassAssignmentResourceId,
  ICourseClassAssignmentController,
  ICourseClassAssignmentService,
  ValuableCourseClassAssignmentModel,
} from "../assignment.type";
import { NextFunction, Request, Response } from "express";
import validateJoi from "../../../common/functions/validateJoi";
import { StatusCode } from "../../../common/constants/statusCode";
import getValuable from "../../../common/functions/removeNullFields";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import isNaNArray from "../../../common/functions/isNaNArray";
import NaNException from "../../../common/class/exceptions/NaNException";
import {
  CreateCourseClassAssignmentDtoJoi,
  UpdateCourseClassAssignmentDtoJoi,
} from "./assignment.joi";

@injectable()
export default class CourseClassAssignmentController
  implements ICourseClassAssignmentController
{
  @inject(CourseClassAssignmentDITypes.CONTROLLER)
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

      const resourceId = this.validateResourceId(req);
      const newAssignment = await this.service.createAssignment(
        resourceId,
        req.body,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({
        data: getValuable(
          newAssignment,
        ) satisfies ValuableCourseClassAssignmentModel,
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
      const assignmentId = this.validateAssignmentId(req);
      const resourceId = this.validateResourceId(req);
      const assignment = await this.service.getAssignmentById(
        assignmentId,
        resourceId,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: getValuable(
          assignment,
        ) satisfies ValuableCourseClassAssignmentModel,
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
      const resourceId = this.validateResourceId(req);
      const assignments = await this.service.getAssignments(resourceId);

      return res.status(StatusCode.SUCCESS).json({
        data: assignments.map((assignment) =>
          getValuable(assignment),
        ) satisfies ValuableCourseClassAssignmentModel[],
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

      const assignmentId = this.validateAssignmentId(req);
      const resourceId = this.validateResourceId(req);
      const updatedAssignment = await this.service.updateAssignment(
        assignmentId,
        resourceId,
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: updatedAssignment satisfies ValuableCourseClassAssignmentModel,
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
      const assignmentId = this.validateAssignmentId(req);
      const resourceId = this.validateResourceId(req);
      await this.service.deleteAssignment(assignmentId, resourceId);

      return res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(req: Request): CourseClassAssignmentResourceId {
    const { id: userId, role } =
      getRequestUserOrThrowAuthenticationException(req);
    const courseId: number = Number(req.params.courseId);
    const classId: number = Number(req.params.classId);
    if (isNaNArray([courseId, classId])) {
      throw new NaNException("courseId || classId");
    }

    return {
      user: {
        id: userId,
        role,
      },
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
