import { UserModel } from "../user/user.type";

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
    export type Dto = {
      title: string;
      description?: string;
      date: Date;
    };
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
      data: {};
    };
  }
}

export const CourseScheduleDITypes = {
  REPOSITORY: Symbol.for("COURSE_SCHEDULE_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_SCHEDULE_EVENT_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_SCHEDULE_EVENT_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_SCHEDULE_EVENT_AUTHORIZATION"),
} as const;

export type CourseScheduleModel = {
  id: number;
  title: string;
  description: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  courseId: number;
};

export type CreateCourseScheduleDto = {
  title: string;
  description?: string;
  date: Date;
};

export type UpdateCourseScheduleDto = Partial<CreateCourseScheduleDto>;

export type CourseScheduleResourceId = {
  user: UserModel;
  params: {
    courseId: number;
  };
};
