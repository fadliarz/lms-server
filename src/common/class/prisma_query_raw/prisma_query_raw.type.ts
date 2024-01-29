import {
  Course,
  CourseCategory,
  CourseEnrollment,
  CourseLesson,
  CourseLessonVideo,
  User,
} from "@prisma/client";
import { PrismaTransaction } from "../../types";

export const PrismaQueryRawDITypes = {
  PRISMA_QUERY_RAW: Symbol.for("PRISMA_QUERY_RAW"),
  USER: Symbol.for("PRISMA_QUERY_USER"),
  COURSE: Symbol.for("PRISMA_QUERY_RAW_COURSE"),
  COURSE_CATEGORY: Symbol.for("PRISMA_QUERY_RAW_COURSE_CATEGORY"),
  COURSE_ENROLLMENT: Symbol.for("PRISMA_QUERY_RAW_COURSE_ENROLLMENT"),
  COURSE_LESSON: Symbol.for("PRISMA_QUERY_RAW_COURSE_LESSON"),
  COURSE_LESSON_VIDEO: Symbol.for("PRISMA_QUERY_RAW_COURSE_LESSON_VIDEO"),
};

export interface IPrismaQueryRaw {
  user: IUserPrismaQueryRaw;
  course: ICoursePrismaQueryRaw;
  courseCategory: ICourseCategoryPrismaQueryRaw;
  courseEnrollment: ICourseEnrollmentPrismaQueryRaw;
  courseLesson: ICourseLessonPrismaQueryRaw;
  courseLessonVideo: ICourseLessonVideoPrismaQueryRaw;
}

export interface IUserPrismaQueryRaw {
  selectForUpdateById: (
    tx: PrismaTransaction,
    userId: number,
  ) => Promise<User | null>;
  selectForUpdateByIdOrThrow: (
    tx: PrismaTransaction,
    userId: number,
    error?: Error,
  ) => Promise<User>;
}

export interface ICoursePrismaQueryRaw {
  selectForUpdateById: (
    tx: PrismaTransaction,
    courseId: number,
  ) => Promise<Course | null>;
  selectForUpdateByIdOrThrow: (
    tx: PrismaTransaction,
    courseId: number,
    error?: Error,
  ) => Promise<Course>;
}

export interface ICourseCategoryPrismaQueryRaw {
  selectForUpdateById: (
    tx: PrismaTransaction,
    categoryId: number,
  ) => Promise<CourseCategory | null>;
  selectForUpdateByIdOrThrow: (
    tx: PrismaTransaction,
    categoryId: number,
    error?: Error,
  ) => Promise<CourseCategory>;
}

export interface ICourseEnrollmentPrismaQueryRaw {
  selectForUpdateById: (
    tx: PrismaTransaction,
    enrollmentId: number,
  ) => Promise<CourseEnrollment | null>;
  selectForUpdateByIdOrThrow: (
    tx: PrismaTransaction,
    enrollmentId: number,
    error?: Error,
  ) => Promise<CourseEnrollment>;
  selectForUpdateByUserIdAndCourseId: (
    tx: PrismaTransaction,
    userId_courseId: {
      userId: number;
      courseId: number;
    },
  ) => Promise<CourseEnrollment | null>;
  selectForUpdateByUserIdAndCourseIdOrThrow: (
    tx: PrismaTransaction,
    userId_courseId: {
      userId: number;
      courseId: number;
    },
    error?: Error,
  ) => Promise<CourseEnrollment>;
}

export interface ICourseLessonPrismaQueryRaw {
  selectForUpdateById: (
    tx: PrismaTransaction,
    lessonId: number,
  ) => Promise<CourseLesson | null>;
  selectForUpdateByIdOrThrow: (
    tx: PrismaTransaction,
    lessonId: number,
    error?: Error,
  ) => Promise<CourseLesson>;
}

export interface ICourseLessonVideoPrismaQueryRaw {
  selectForUpdateById: (
    tx: PrismaTransaction,
    videoId: number,
  ) => Promise<CourseLessonVideo | null>;
  selectForUpdateByIdOrThrow: (
    tx: PrismaTransaction,
    videoId: number,
    error?: Error,
  ) => Promise<CourseLessonVideo>;
}
