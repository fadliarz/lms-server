import { inject, injectable } from "inversify";
import { NextFunction, Request, Response } from "express";
import validateJoi from "../../../common/functions/validateJoi";
import { StatusCode } from "../../../common/constants/statusCode";
import isNaNArray from "../../../common/functions/isNaNArray";
import NaNException from "../../../common/class/exceptions/NaNException";
import {
  DepartmentProgramDITypes,
  DepartmentProgramResourceId,
} from "../program.type";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import {
  CreateDepartmentProgramDtoJoi,
  UpdateDepartmentProgramDtoJoi,
} from "./program.joi";
import {
  IDepartmentProgramController,
  IDepartmentProgramService,
} from "../program.interface";

@injectable()
export default class DepartmentProgramController
  implements IDepartmentProgramController
{
  @inject(DepartmentProgramDITypes.SERVICE)
  service: IDepartmentProgramService;

  public async createProgram(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateDepartmentProgramDtoJoi })(
        req,
        res,
        next,
      );

      const newProgram = await this.service.createProgram(
        getRequestUserOrThrowAuthenticationException(req),
        { resourceId: this.validateResourceId(req) },
        req.body,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({
        data: newProgram,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getAllPrograms(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const programs = await this.service.getAllPrograms();

      return res.status(StatusCode.SUCCESS).json({
        data: programs,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getPrograms(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const programs = await this.service.getPrograms({
        resourceId: this.validateResourceId(req),
      });

      return res.status(StatusCode.SUCCESS).json({
        data: programs,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getProgramById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const program = await this.service.getProgramById({
        programId: this.validateProgramId(req),
        resourceId: this.validateResourceId(req),
      });

      return res.status(StatusCode.SUCCESS).json({
        data: program,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateProgram(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateDepartmentProgramDtoJoi })(
        req,
        res,
        next,
      );

      const updatedProgram = await this.service.updateProgram(
        getRequestUserOrThrowAuthenticationException(req),
        {
          programId: this.validateProgramId(req),
          resourceId: this.validateResourceId(req),
        },
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: updatedProgram,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteProgram(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await this.service.deleteProgram(
        getRequestUserOrThrowAuthenticationException(req),
        {
          programId: this.validateProgramId(req),
          resourceId: this.validateResourceId(req),
        },
      );

      return res.status(StatusCode.SUCCESS).json({
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(req: Request): DepartmentProgramResourceId {
    const departmentId: number = Number(req.params.departmentId);
    if (isNaNArray([departmentId])) {
      throw new NaNException("departmentId");
    }

    return {
      departmentId,
    };
  }

  private validateProgramId(req: Request): number {
    const programId: number = Number(req.params.programId);
    if (isNaN(programId)) {
      throw new NaNException("programId");
    }

    return programId;
  }
}
