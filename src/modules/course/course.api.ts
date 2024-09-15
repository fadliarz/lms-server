import { CourseLessonModel } from "../lesson/lesson.type";
import { CourseLessonVideoModel } from "../video/video.type";
import { CourseLikeModel, CourseModel, CourseStatusModel } from "./course.type";
import { CourseCategoryModel } from "../category/category.type";
import { PagingQuery } from "../../common/shared.types";
import { UserModel } from "../user/user.type";
import { CourseEnrollmentModel } from "../enrollment/enrollment.type";

export namespace $CourseAPI {
  const root = "/courses";
  const course = "/courses/:courseId";

  export namespace CreateCourse {
    export const endpoint = root;
    export const generateUrl = () => endpoint;
    export type Dto = {
      code: string;
      status: CourseStatusModel;
      image?: string;
      title: string;
      description?: string;
      material?: string;
      categoryId?: number;
    };
    export type Response = {
      data: CourseModel;
    };
  }

  export namespace CreateCourseInstructor {
    export const endpoint = course + "/instructors";
    export const generateUrl = (courseId: number) =>
      `/courses/${courseId}/instructors`;
    export type Dto = {
      userId: number;
    };
    export type Response = {
      data: CourseEnrollmentModel;
    };
  }

  export namespace GetCourses {
    export const endpoint = root;
    export const generateUrl = () => endpoint;
    export type Query = {
      include_category?: boolean;
    } & PagingQuery;
    export type Response = {
      data: (CourseModel & {
        category?: Pick<CourseCategoryModel, "id" | "title"> | null;
      })[];
    };
  }

  export namespace GetCourseById {
    export const endpoint = course;
    export const generateUrl = (courseId: number) => `/courses/${courseId}`;
    export type Query = {
      include_category?: boolean;
      include_lessons?: boolean;
      include_public_videos?: boolean;
    };
    export type Response = {
      data: CourseModel & {
        category?: Pick<CourseCategoryModel, "id" | "title"> | null;
        lessons?: (Pick<
          CourseLessonModel,
          | "id"
          | "title"
          | "description"
          | "totalVideos"
          | "totalDurations"
          | "totalMaterials"
        > & {
          videos?: Pick<
            CourseLessonVideoModel,
            "id" | "name" | "description" | "totalDurations"
          >[];
        })[];
      };
    };
  }

  export namespace GetCourseInstructors {
    export const endpoint = course + "/instructors";
    export const generateUrl = (courseId: number) =>
      `/courses/${courseId}/instructors`;
    export type Query = PagingQuery;
    export type Response = {
      data: Pick<UserModel, "id" | "name" | "NIM">[];
    };
  }

  export namespace UpdateCourse {
    export const endpoint = course;
    export const generateUrl = (courseId: number) => `/courses/${courseId}`;
    export type Dto = {
      image?: string;
      title?: string;
      description?: string;
      material?: string;
    };
    export type Response = {
      data: CourseModel;
    };
  }

  export namespace UpdateCourseStatus {
    export const endpoint = `${course}/status`;
    export const generateUrl = (courseId: number) =>
      `/courses/${courseId}/status`;
    export type Dto = {
      status: CourseStatusModel;
    };
    export type Response = {
      data: CourseModel;
    };
  }

  export namespace UpdateCourseCategoryId {
    export const endpoint = `${course}/category`;
    export const generateUrl = (courseId: number) =>
      `/courses/${courseId}/category`;
    export type Dto = {
      categoryId: number;
    };
    export type Response = {
      data: CourseModel;
    };
  }

  export namespace UpdateCourseCode {
    export const endpoint = `${course}/code`;
    export const generateUrl = (courseId: number) =>
      `/courses/${courseId}/code`;
    export type Dto = {
      code: string;
    };
    export type Response = {
      data: CourseModel;
    };
  }

  export namespace DeleteCourse {
    export const endpoint = course;
    export const generateUrl = (courseId: number) => `/courses/${courseId} `;
    export type Response = {
      data: {};
    };
  }

  export namespace CreateLike {
    export const endpoint = `${course}/likes`;
    export const generateUrl = (courseId: number) =>
      `/courses/${courseId}/likes`;
    export type Dto = {};
    export type Response = {
      data: CourseLikeModel;
    };
  }

  export namespace DeleteLike {
    export const endpoint = `${course}/likes/:likeId`;
    export const generateUrl = (courseId: number, likeId: number) =>
      `/courses/${courseId}/likes/${likeId}`;
    export type Response = {
      data: CourseLikeModel;
    };
  }
}
