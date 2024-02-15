import { CourseEnrollmentRole } from "@prisma/client";
import {
  CourseEnrollmentRoleModel,
  CourseLikeModel,
  CourseModel,
  CreateCourseDto,
  UserRoleModel,
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
import { CourseEnrollmentModel } from "../../../modules/enrollment/enrollment.type";

export const PrismaRandDBDITypes = {
  FACADE: Symbol.for("FACACDE_PRISMA_RAND_DB"),
  USER: Symbol.for("PRISMA_USER_RAND_DB"),
  COURSE_CATEGORY: Symbol.for("PRISMA_COURSE_CATEGORY_RAND_DB"),
  COURSE_ENROLLMENT: Symbol.for("PRISMA_COURSE_ENROLLMENT_RAND_DB"),
  COURSE: Symbol.for("PRISMA_COURSE_RAND_DB"),
  COURSE_LESSON: Symbol.for("PRISMA_COURSE_LESSON_RAND_DB"),
  COURSE_LESSON_VIDEO: Symbol.for("PRISMA_COURSE_LESSON_VIDEO_RAND_DB"),
};

export interface IRandDB {
  user: IUserRandDB;
  courseCategory: ICourseCategoryRandDB;
  courseEnrollment: ICourseEnrollmentRandDB;
  course: ICourseRandDB;
  courseLesson: ICourseLessonRandDB;
  courseLessonVideo: ICourseLessonVideoRandBD;
}

export interface IUserRandDB {
  generateOne: (role: UserRole) => Promise<UserModel>;
}

export interface ICourseCategoryRandDB {
  generateOne: () => Promise<CourseCategoryModel>;
}

export interface ICourseEnrollmentRandDB {
  generateOne: ({
    authorUserRole,
    userRole,
    enrollmentRole,
  }: {
    authorUserRole: UserRoleModel;
    userRole: UserRoleModel;
    enrollmentRole: CourseEnrollmentRoleModel;
  }) => Promise<{
    author: UserModel;
    enrolledUser: UserModel;
    category: CourseCategoryModel;
    course: CourseModel;
    enrollment: CourseEnrollmentModel;
  }>;
}

export interface ICourseRandDB {
  generateOne: (authorUserRole: UserRoleModel) => Promise<{
    author: UserModel;
    category: CourseCategoryModel;
    course: CourseModel;
  }>;
}

export interface ICourseLessonRandDB {
  generateOne: (authorUserRole: UserRoleModel) => Promise<{
    author: UserModel;
    category: CourseCategoryModel;
    course: CourseModel;
    lesson: CourseLessonModel;
  }>;
}

export interface ICourseLessonVideoRandBD {
  generateOne: (authorUserRole: UserRoleModel) => Promise<{
    author: UserModel;
    category: CourseCategoryModel;
    course: CourseModel;
    lesson: CourseLessonModel;
    video: CourseLessonVideoModel;
  }>;
}
