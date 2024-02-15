import {
  CourseLikeModel,
  CourseModel,
} from "../../../modules/course/course.type";
import { CourseLessonModel } from "../../../modules/lesson/lesson.type";
import { CourseLessonVideoModel } from "../../../modules/video/video.type";
import { CourseEnrollmentModel } from "../../../modules/enrollment/enrollment.type";

export interface ITable {
  course: ICourseTable;
  courseEnrollment: ICourseEnrollmentTable;
  courseLesson: ICourseLessonTable;
  courseLessonVideo: ICourseLessonVideoTable;
  courseLike: ICourseLikeTable;
}

export interface ICourseTable {
  findUnique: (courseId: number) => Promise<CourseModel | null>;
  findUniqueOrThrow: (
    courseId: number,
    errorObject?: Error,
  ) => Promise<CourseModel>;
  delete: (courseId: number) => Promise<CourseModel>;
}

export interface ICourseEnrollmentTable {
  findUnique: (enrollmentId: number) => Promise<CourseEnrollmentModel | null>;
  findUniqueOrThrow: (
    enrollmentId: number,
    errorObject?: Error,
  ) => Promise<CourseEnrollmentModel>;
  findUniqueByUserIdAndCourseId: (
    userId: number,
    courseId: number,
  ) => Promise<CourseEnrollmentModel | null>;
  findUniqueByUserIdAndCourseIdOrThrow: (
    userId: number,
    courseId: number,
    error?: Error,
  ) => Promise<CourseEnrollmentModel>;
  delete: (enrollmentId: number) => Promise<CourseEnrollmentModel>;
}

export interface ICourseLessonTable {
  findUnique: (lessonId: number) => Promise<CourseLessonModel | null>;
  findUniqueOrThrow: (
    lessonId: number,
    errorObject?: Error,
  ) => Promise<CourseLessonModel>;
}

export interface ICourseLessonVideoTable {
  findUnique: (videoId: number) => Promise<CourseLessonVideoModel | null>;
  findUniqueOrThrow: (
    videoId: number,
    errorObject?: Error,
  ) => Promise<CourseLessonVideoModel>;
  delete: (videoId: number) => Promise<CourseLessonVideoModel>;
}

export interface ICourseLikeTable {
  findUnique: (likeId: number) => Promise<CourseLikeModel | null>;
  findUniqueOrThrow: (
    likeId: number,
    errorObject?: Error,
  ) => Promise<CourseLikeModel>;
}
