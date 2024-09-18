import { CourseClassModel } from "./class.type";
import { PagingQuery } from "../../common/shared.types";

export namespace $CourseClassAPI {
  const root = "/courses/:courseId/classes";
  const theClass = root + "/:classId";

  export namespace CreateClass {
    export const endpoint = root;
    export const generateUrl = (courseId: number) =>
      `/courses/${courseId}/classes`;
    export type Dto = {
      title: string;
    };
    export type Response = {
      data: CourseClassModel;
    };
  }

  export namespace GetClasses {
    export const endpoint = root;
    export const generateUrl = (courseId: number) =>
      `/courses/${courseId}/classes`;
    export type Query = PagingQuery;
    export type Response = {
      data: CourseClassModel[];
    };
  }

  export namespace GetClassById {
    export const endpoint = theClass;
    export const generateUrl = (courseId: number, classId: number) =>
      `/courses/${courseId}/classes/${classId}`;
    export type Response = {
      data: CourseClassModel;
    };
  }

  export namespace UpdateClass {
    export const endpoint = theClass;
    export const generateUrl = (courseId: number, classId: number) =>
      `/courses/${courseId}/classes/${classId}`;
    export type Dto = {
      title?: string;
    };
    export type Response = {
      data: CourseClassModel;
    };
  }

  export namespace DeleteClass {
    export const endpoint = theClass;
    export const generateUrl = (courseId: number, classId: number) =>
      `/courses/${courseId}/classes/${classId}`;
    export type Response = {
      data: { id: number };
    };
  }
}
