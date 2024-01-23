import { CourseEnrollmentRole } from "@prisma/client";
import {
  CourseEnrollmentModel,
  CourseLikeModel,
  CourseModel,
  CreateCourseDto,
} from "../../../modules/course/course.type";
import { UserModel, UserRole } from "../../../modules/user/user.type";
import {
  CourseLessonModel,
  CreateCourseLessonDto,
} from "../../../modules/lesson/lesson.type";
import { CourseLessonVideoModel } from "../../../modules/video/video.type";
import {
  CourseCategoryModel,
  CreateCourseCategoryDto,
} from "../../../modules/category/category.type";

export default interface RandDB {
  /**
   *
   *
   * Generate Row
   *
   *
   */

  generateUser: (role: UserRole) => Promise<UserModel>;
  generateCourse: () => Promise<{
    author: UserModel;
    category: CourseCategoryModel;
    course: CourseModel;
  }>;
  generateCategory: () => Promise<CourseCategoryModel>;
  generateLesson: () => Promise<{
    author: UserModel;
    category: CourseCategoryModel;
    course: CourseModel;
    lesson: CourseLessonModel;
  }>;

  /**
   *
   *
   * Generate Dto
   *
   *
   */

  generateCreateCourseDto: (categoryId: number) => CreateCourseDto;
  generateCreateCategoryDto: () => CreateCourseCategoryDto;
  generateCreateLessonDto: () => CreateCourseLessonDto;

  /**
   *
   *
   * Insert
   *
   *
   */

  insertManyLessonsIntoCourse: (
    courseId: number,
    numberOfLessons: number
  ) => Promise<CourseLessonModel[]>;
  insertManyVideosIntoLesson: (
    lessonId: number,
    numberOfVideos: number,
    durationEachVideo: number
  ) => Promise<CourseLessonVideoModel[]>;
  insertOneEnrollmentIntoCourse: (
    userId: number,
    courseId: number,
    enrollmentRole: CourseEnrollmentRole
  ) => Promise<CourseEnrollmentModel>;
  insertOneLikeIntoCourse: (
    userId: number,
    courseId: number
  ) => Promise<CourseLikeModel>;
}
