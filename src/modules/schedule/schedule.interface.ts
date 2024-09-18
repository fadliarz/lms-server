import { UserModel } from "../user/user.type";
import { CourseScheduleModel, CourseScheduleResourceId } from "./schedule.type";
import { NextFunction, Request, Response } from "express";
import { $CourseScheduleAPI } from "./schedule.api";

export interface ICourseScheduleAuthorization {
  authorizeCreateSchedule: (user: UserModel, courseId: number) => Promise<void>;
  authorizeReadSchedule: (user: UserModel, courseId: number) => Promise<void>;
  authorizeUpdateSchedule: (user: UserModel, courseId: number) => Promise<void>;
  authorizeDeleteSchedule: (user: UserModel, courseId: number) => Promise<void>;
}

export interface ICourseScheduleController {
  createSchedule: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getSchedules: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getScheduleById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateSchedule: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteSchedule: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export interface ICourseScheduleService {
  createSchedule: (
    resourceId: CourseScheduleResourceId,
    dto: $CourseScheduleAPI.CreateSchedule.Dto,
  ) => Promise<$CourseScheduleAPI.CreateSchedule.Response["data"]>;
  getSchedules: (
    resourceId: CourseScheduleResourceId,
    query: $CourseScheduleAPI.GetSchedules.Query,
  ) => Promise<$CourseScheduleAPI.GetSchedules.Response["data"]>;
  getScheduleById: (
    scheduleId: number,
    resourceId: CourseScheduleResourceId,
  ) => Promise<CourseScheduleModel>;
  updateSchedule: (
    scheduleId: number,
    resourceId: CourseScheduleResourceId,
    dto: $CourseScheduleAPI.UpdateSchedule.Dto,
  ) => Promise<CourseScheduleModel>;
  deleteSchedule: (
    scheduleId: number,
    resourceId: CourseScheduleResourceId,
  ) => Promise<$CourseScheduleAPI.DeleteSchedule.Response["data"]>;
}

export interface ICourseScheduleRepository {
  createSchedule: (
    id: CourseScheduleResourceId["params"],
    data: $CourseScheduleAPI.CreateSchedule.Dto,
  ) => Promise<CourseScheduleModel>;
  getSchedules: (
    id: CourseScheduleResourceId["params"],
    query?: $CourseScheduleAPI.GetSchedules.Query,
  ) => Promise<CourseScheduleModel[]>;
  getScheduleById: (id: {
    scheduleId: number;
    resourceId?: CourseScheduleResourceId["params"];
  }) => Promise<CourseScheduleModel | null>;
  getScheduleByIdOrThrow: (
    id: {
      scheduleId: number;
      resourceId?: CourseScheduleResourceId["params"];
    },
    error?: Error,
  ) => Promise<CourseScheduleModel>;
  updateSchedule: (
    id: {
      scheduleId: number;
      resourceId?: CourseScheduleResourceId["params"];
    },
    data: Partial<CourseScheduleModel>,
  ) => Promise<CourseScheduleModel>;
  deleteSchedule: (id: {
    scheduleId: number;
    resourceId?: CourseScheduleResourceId["params"];
  }) => Promise<{ id: number }>;
}
