import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import {
  ICourseScheduleController,
  ICourseScheduleService,
} from "../schedule.interface";
import {
  CourseScheduleDITypes,
  CourseScheduleResourceId,
} from "../schedule.type";
import validateJoi from "../../../common/functions/validateJoi";
import {
  CreateCourseScheduleDtoJoi,
  GetCourseSchedulesQuery,
  UpdateCourseScheduleDtoJoi,
} from "./schedule.joi";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import NaNException from "../../../common/class/exceptions/NaNException";
import { StatusCode } from "../../../common/constants/statusCode";
import getPagingQuery from "../../../common/functions/getPagingQuery";

@injectable()
export default class CourseScheduleController
  implements ICourseScheduleController
{
  @inject(CourseScheduleDITypes.SERVICE)
  private readonly service: ICourseScheduleService;

  public async createSchedule(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateCourseScheduleDtoJoi })(req, res, next);

      const newSchedule = await this.service.createSchedule(
        this.validateResourceId(req),
        req.body,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({
        data: newSchedule,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getSchedules(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ query: GetCourseSchedulesQuery })(req, res, next);

      const schedules = await this.service.getSchedules(
        this.validateResourceId(req),
        getPagingQuery(req.query),
      );

      return res.status(StatusCode.SUCCESS).json({
        data: schedules,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getScheduleById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const schedule = await this.service.getScheduleById(
        this.validateScheduleId(req),
        this.validateResourceId(req),
      );

      return res.status(StatusCode.SUCCESS).json({
        data: schedule,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateSchedule(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateCourseScheduleDtoJoi })(req, res, next);

      const updatedSchedule = await this.service.updateSchedule(
        this.validateScheduleId(req),
        this.validateResourceId(req),
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: updatedSchedule,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteSchedule(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await this.service.deleteSchedule(
        this.validateScheduleId(req),
        this.validateResourceId(req),
      );

      res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }

  private validateScheduleId(req: Request): number {
    const scheduleId: number = Number(req.params.scheduleId);
    if (isNaN(scheduleId)) {
      throw new NaNException("scheduleId");
    }

    return scheduleId;
  }

  private validateResourceId(req: Request): CourseScheduleResourceId {
    const courseId: number = Number(req.params.courseId);
    if (isNaN(courseId)) {
      throw new NaNException("courseId");
    }

    return {
      user: getRequestUserOrThrowAuthenticationException(req),
      params: {
        courseId,
      },
    };
  }
}
