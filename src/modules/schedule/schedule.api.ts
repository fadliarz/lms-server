import { CourseScheduleModel } from "./schedule.type";
import { PagingQuery } from "../../common/shared.types";

export namespace $CourseScheduleAPI {
  const root = "/courses/:courseId/schedules";
  const schedule = root + "/:scheduleId";

  export namespace CreateSchedule {
    export const endpoint = root;
    export const generateUrl = (courseId: number) =>
      `/courses/${courseId}/schedules`;
    export type Dto = {
      title: string;
      description?: string;
      date: Date;
    };
    export type Response = {
      data: CourseScheduleModel;
    };
  }

  export namespace GetSchedules {
    export const endpoint = root;
    export const generateUrl = (courseId: number) =>
      `/courses/${courseId}/schedules`;
    export type Query = PagingQuery;
    export type Response = {
      data: CourseScheduleModel[];
    };
  }

  export namespace GetScheduleById {
    export const endpoint = root;
    export const generateUrl = (courseId: number, scheduleId: number) =>
      `/courses/${courseId}/schedules/${scheduleId}`;
    export type Response = {
      data: CourseScheduleModel;
    };
  }

  export namespace UpdateSchedule {
    export const endpoint = root;
    export const generateUrl = (courseId: number, scheduleId: number) =>
      `/courses/${courseId}/schedules/${scheduleId}`;
    export type Dto = {
      title?: string;
      description?: string;
      date?: Date;
    };
    export type Response = {
      data: CourseScheduleModel;
    };
  }

  export namespace DeleteSchedule {
    export const endpoint = root;
    export const generateUrl = (courseId: number, scheduleId: number) =>
      `/courses/${courseId}/schedules/${scheduleId}`;
    export type Response = {
      data: { id: number };
    };
  }
}
