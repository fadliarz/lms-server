import { CourseLessonModel } from "./lesson.type";
import { PagingQuery } from "../../common/shared.types";

export namespace $CourseLessonAPI {
  const root = "/courses/:courseId/lessons";
  const lesson = root + "/:lessonId";

  export namespace CreateLesson {
    export const endpoint = root;
    export const generateUrl = (courseId: number) =>
      `/courses/${courseId}/lessons`;
    export type Dto = {
      title: string;
      description?: string;
    };
    export type Response = {
      data: CourseLessonModel;
    };
  }

  export namespace GetLessons {
    export const endpoint = root;
    export const generateUrl = (courseId: number) =>
      `/courses/${courseId}/lessons`;
    export type Query = PagingQuery;
    export type Response = {
      data: CourseLessonModel[];
    };
  }

  export namespace GetLessonById {
    export const endpoint = lesson;
    export const generateUrl = (courseId: number, lessonId: number) =>
      `/courses/${courseId}/lessons/${lessonId}`;
    export type Response = { data: CourseLessonModel };
  }

  export namespace UpdateLesson {
    export const endpoint = lesson;
    export const generateUrl = (courseId: number, lessonId: number) =>
      `/courses/${courseId}/lessons/${lessonId}`;
    export type Dto = {
      title: string;
      description?: string;
    };
    export type Response = { data: CourseLessonModel };
  }

  export namespace DeleteLesson {
    export const endpoint = lesson;
    export const generateUrl = (courseId: number, lessonId: number) =>
      `/courses/${courseId}/lessons/${lessonId}`;
    export type Response = { data: {} };
  }
}
