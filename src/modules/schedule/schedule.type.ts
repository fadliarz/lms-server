import { UserModel } from "../user/user.type";

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

export type CourseScheduleResourceId = {
  user: UserModel;
  params: {
    courseId: number;
  };
};
