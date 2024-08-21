import { UserModel } from "../../../modules/user/user.type";
import { CourseModel } from "../../../modules/course/course.type";
import { CourseCategoryModel } from "../../../modules/category/category.type";
import { CourseEnrollmentModel } from "../../../modules/enrollment/enrollment.type";
import { CourseLessonModel } from "../../../modules/lesson/lesson.type";
import { CourseLessonVideoModel } from "../../../modules/video/video.type";
import { PrismaTransaction } from "../../types";
import { DepartmentModel } from "../../../modules/department/department.type";

export const PrismaQueryRawDITypes = {
  PRISMA_QUERY_RAW: Symbol.for("PRISMA_QUERY_RAW"),
  USER: Symbol.for("PRISMA_QUERY_USER"),
  COURSE: Symbol.for("PRISMA_QUERY_RAW_COURSE"),
  COURSE_CATEGORY: Symbol.for("PRISMA_QUERY_RAW_COURSE_CATEGORY"),
  COURSE_ENROLLMENT: Symbol.for("PRISMA_QUERY_RAW_COURSE_ENROLLMENT"),
  COURSE_LESSON: Symbol.for("PRISMA_QUERY_RAW_COURSE_LESSON"),
  COURSE_LESSON_VIDEO: Symbol.for("PRISMA_QUERY_RAW_COURSE_LESSON_VIDEO"),
  DEPARTMENT: Symbol.for("RISMA_QUERY_RAW_DEPARTMENT"),
};

export interface IPrismaQueryRaw {
  user: IUserPrismaQueryRaw;
  course: ICoursePrismaQueryRaw;
  courseCategory: ICourseCategoryPrismaQueryRaw;
  courseEnrollment: ICourseEnrollmentPrismaQueryRaw;
  courseLesson: ICourseLessonPrismaQueryRaw;
  courseLessonVideo: ICourseLessonVideoPrismaQueryRaw;
  department: IDepartmentPrismaQueryRaw;
}

export interface IUserPrismaQueryRaw {
  selectForUpdateById: (
    tx: PrismaTransaction,
    userId: number,
  ) => Promise<UserModel | null>;
  selectForUpdateByIdOrThrow: (
    tx: PrismaTransaction,
    userId: number,
    error?: Error,
  ) => Promise<UserModel>;
}

export interface ICoursePrismaQueryRaw {
  selectForUpdateById: (
    tx: PrismaTransaction,
    courseId: number,
  ) => Promise<CourseModel | null>;
  selectForUpdateByIdOrThrow: (
    tx: PrismaTransaction,
    courseId: number,
    error?: Error,
  ) => Promise<CourseModel>;
}

export interface ICourseCategoryPrismaQueryRaw {
  selectForUpdateById: (
    tx: PrismaTransaction,
    categoryId: number,
  ) => Promise<CourseCategoryModel | null>;
  selectForUpdateByIdOrThrow: (
    tx: PrismaTransaction,
    categoryId: number,
    error?: Error,
  ) => Promise<CourseCategoryModel>;
}

export interface ICourseEnrollmentPrismaQueryRaw {
  selectForUpdateById: (
    tx: PrismaTransaction,
    enrollmentId: number,
  ) => Promise<CourseEnrollmentModel | null>;
  selectForUpdateByIdOrThrow: (
    tx: PrismaTransaction,
    enrollmentId: number,
    error?: Error,
  ) => Promise<CourseEnrollmentModel>;
  selectForUpdateByUserIdAndCourseId: (
    tx: PrismaTransaction,
    userId_courseId: {
      userId: number;
      courseId: number;
    },
  ) => Promise<CourseEnrollmentModel | null>;
  selectForUpdateByUserIdAndCourseIdOrThrow: (
    tx: PrismaTransaction,
    userId_courseId: {
      userId: number;
      courseId: number;
    },
    error?: Error,
  ) => Promise<CourseEnrollmentModel>;
}

export interface ICourseLessonPrismaQueryRaw {
  selectForUpdateById: (
    tx: PrismaTransaction,
    lessonId: number,
  ) => Promise<CourseLessonModel | null>;
  selectForUpdateByIdOrThrow: (
    tx: PrismaTransaction,
    lessonId: number,
    error?: Error,
  ) => Promise<CourseLessonModel>;
}

export interface ICourseLessonVideoPrismaQueryRaw {
  selectForUpdateById: (
    tx: PrismaTransaction,
    videoId: number,
  ) => Promise<CourseLessonVideoModel | null>;
  selectForUpdateByIdOrThrow: (
    tx: PrismaTransaction,
    videoId: number,
    error?: Error,
  ) => Promise<CourseLessonVideoModel>;
}

export interface IDepartmentPrismaQueryRaw {
  selectForUpdateById: (
    tx: PrismaTransaction,
    departmentId: number,
  ) => Promise<DepartmentModel | null>;
  selectForUpdateByIdOrThrow: (
    tx: PrismaTransaction,
    departmentId: number,
    error?: Error,
  ) => Promise<DepartmentModel>;
}
