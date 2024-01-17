import { Role } from "@prisma/client";
import {
  CourseEnrollmentModel,
  CourseLikeModel,
  CourseModel,
  CreateCourseDto,
} from "../../../modules/course/course.type";
import { UserModel } from "../../../modules/user/user.type";
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
  generateUser: (role: Role) => Promise<UserModel>;
  generateCreateCourseDto: (categoryId: number) => CreateCourseDto;
  generateCreateCategoryDto: () => CreateCourseCategoryDto;
  generateCreateLessonDto: () => CreateCourseLessonDto;
  generateCourse: () => Promise<{
    author: UserModel;
    category: CourseCategoryModel;
    course: CourseModel;
  }>;
  generateLesson: () => Promise<{
    author: UserModel;
    category: CourseCategoryModel;
    course: CourseModel;
    lesson: CourseLessonModel,
  }>
  insertManyLessonsIntoCourse: (
    courseId: number,
    numberOfLessons: number
  ) => Promise<CourseLessonModel[]>;
  insertManyVideosIntoLesson: (
    lessonId: number,
    numberOfVideos: number
  ) => Promise<CourseLessonVideoModel[]>;
  insertOneEnrollmentIntoCourse: (
    userId: number,
    courseId: number,
    enrollmentRole: Role
  ) => Promise<CourseEnrollmentModel>;
  insertOneLikeIntoCourse: (
    userId: number,
    courseId: number
  ) => Promise<CourseLikeModel>;
}
