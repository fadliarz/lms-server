import { inject, injectable } from "inversify";
import {
  PersonalAssignmentDITypes,
  PersonalAssignmentResourceId,
} from "../assignment.type";
import {
  IPersonalAssignmentController,
  IPersonalAssignmentService,
} from "../assignment.interface";
import { NextFunction, Request, Response } from "express";
import validateJoi from "../../../common/functions/validateJoi";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import NaNException from "../../../common/class/exceptions/NaNException";
import { StatusCode } from "../../../common/constants/statusCode";
import {
  CreatePersonalAssignmentDtoJoi,
  UpdatePersonalAssignmentDtoJoi,
} from "./assignment.joi";

@injectable()
export default class PersonalAssignmentController
  implements IPersonalAssignmentController
{
  @inject(PersonalAssignmentDITypes.SERVICE)
  private readonly service: IPersonalAssignmentService;

  public async createAssignment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreatePersonalAssignmentDtoJoi })(
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

  public async updateAssignment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdatePersonalAssignmentDtoJoi })(
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

      res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }

  private validateAssignmentId(req: Request): number {
    const assignmentId: number = Number(req.params.assignmentId);
    if (isNaN(assignmentId)) {
      throw new NaNException("assignmentId");
    }

    return assignmentId;
  }

  private validateResourceId(req: Request): PersonalAssignmentResourceId {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
      throw new NaNException("userId");
    }

    return {
      userId,
    };
  }
}
