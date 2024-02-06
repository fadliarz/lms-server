import "reflect-metadata";

import { Container } from "inversify";
import { UserController } from "./modules/user/controller/user.controller";
import { UserRepository } from "./modules/user/repository/user.repository";
import { UserService } from "./modules/user/service/user.service";
import { IUserController } from "./modules/user/controller/user.controller";
import { IUserService } from "./modules/user/service/user.service";
import { IUserRepository } from "./modules/user/repository/user.repository";
import { UserDITypes } from "./modules/user/user.type";
import { ICourseController } from "./modules/course/controller/course.controller";
import { ICourseService } from "./modules/course/service/course.service";
import { ICourseRepository } from "./modules/course/repository/course.repository";
import { CourseDITypes } from "./modules/course/course.type";
import { CourseRepository } from "./modules/course/repository/course.repository";
import { CourseService } from "./modules/course/service/course.service";
import { CourseController } from "./modules/course/controller/course.controller";
import {
  CourseEnrollmentController,
  ICourseEnrollmentController,
} from "./modules/enrollment/controller/enrollment.controller";
import { CourseEnrollmentDITypes } from "./modules/enrollment/enrollment.type";
import {
  CourseEnrollmentService,
  ICourseEnrollmentService,
} from "./modules/enrollment/service/enrollment.service";
import CourseEnrollmentRepository, {
  ICourseEnrollmentRepository,
} from "./modules/enrollment/repository/enrollment.repository";
import {
  CourseLessonRepository,
  ICourseLessonRepository,
} from "./modules/lesson/repository/lesson.repository";
import {
  CourseLessonDITypes,
  ICourseLessonAuthorization,
} from "./modules/lesson/lesson.type";
import {
  CourseLessonService,
  ICourseLessonService,
} from "./modules/lesson/service/lesson.service";
import {
  CourseLessonController,
  ICourseLessonController,
} from "./modules/lesson/controller/lesson.controller";
import {
  CourseLessonVideoRepository,
  ICourseLessonVideoRepository,
} from "./modules/video/repository/video.repository";
import {
  CourseLessonVideoDITypes,
  ICourseLessonVideoAuthorization,
} from "./modules/video/video.type";
import {
  CourseLessonVideoService,
  ICourseLessonVideoService,
} from "./modules/video/service/video.service";
import {
  CourseLessonVideoController,
  ICourseLessonVideoController,
} from "./modules/video/controller/video.controller";
import {
  CourseCategoryRepository,
  ICourseCategoryRepository,
} from "./modules/category/repository/category.repository";
import {
  CourseCategoryService,
  ICourseCategoryService,
} from "./modules/category/service/category.service";
import {
  CourseCategoryController,
  ICourseCategoryController,
} from "./modules/category/controller/category.controller";
import {
  CourseCategoryDITypes,
  ICourseCategoryAuthorization,
} from "./modules/category/category.type";
import {
  CourseAuthorizationMiddleware,
  ICourseAuthorizationMiddleware,
} from "./modules/course/authorization/course.authorization";
import {
  ICourseEnrollmentTable,
  ICourseLessonTable,
  ICourseLessonVideoTable,
  ICourseLikeTable,
  ICourseTable,
  ITable,
} from "./common/class/table/table.type";
import PrismaTable, {
  PrismaTableDITypes,
} from "./common/class/table/PrismaTable";
import PrismaCourseTable from "./common/class/table/PrismaCourseTable";
import PrismaCourseEnrollmentTable from "./common/class/table/PrismaCourseEnrollmentTable";
import PrismaCourseLessonTable from "./common/class/table/PrismaCourseLessonTable";
import PrismaCourseLessonVideoTable from "./common/class/table/PrismaCourseLessonVideoTable";
import PrismaCourseLikeTable from "./common/class/table/PrismaCourseLikeTable";
import CourseEnrollmentAuthorization from "./modules/enrollment/authorization/enrollment.authorization";
import {
  ICoursePrismaPromise,
  IPrismaPromise,
  PrismaPromiseDITypes,
} from "./common/class/prisma_promise/prisma_promise.type";
import PrismaPromise from "./common/class/prisma_promise/PrismaPromise";
import CoursePrismaPromise from "./common/class/prisma_promise/CoursePrismaPromise";
import {
  ICourseCategoryPrismaQueryRaw,
  ICourseEnrollmentPrismaQueryRaw,
  ICourseLessonPrismaQueryRaw,
  ICourseLessonVideoPrismaQueryRaw,
  ICoursePrismaQueryRaw,
  IPrismaQueryRaw,
  IUserPrismaQueryRaw,
  PrismaQueryRawDITypes,
} from "./common/class/prisma_query_raw/prisma_query_raw.type";
import PrismaQueryRaw from "./common/class/prisma_query_raw/PrismaQueryRaw";
import UserPrismaQueryRaw from "./common/class/prisma_query_raw/UserPrismaQueryRaw";
import CoursePrismaQueryRaw from "./common/class/prisma_query_raw/CoursePrismaQueryRaw";
import CourseEnrollmentPrismaQueryRaw from "./common/class/prisma_query_raw/CourseEnrollmentPrismaQueryRaw";
import CourseLessonPrismaQueryRaw from "./common/class/prisma_query_raw/CourseLessonPrismaQueryRaw";
import CourseLessonAuthorization from "./modules/lesson/authorization/lesson.authorization";
import CourseLessonVideoAuthorization from "./modules/video/authorization/video.authorization";
import CourseLessonVideoPrismaQueryRaw from "./common/class/prisma_query_raw/CourseLessonVideoPrismaQueryRaw";
import CourseCategoryAuthorization from "./modules/category/authorization/category.authorization";
import CourseCategoryPrismaQueryRaw from "./common/class/prisma_query_raw/CourseCategoryPrismaQueryRaw";

const dIContainer = new Container();

/**
 * PrismaQueryRaw
 *
 */
dIContainer
  .bind<IPrismaQueryRaw>(PrismaQueryRawDITypes.PRISMA_QUERY_RAW)
  .to(PrismaQueryRaw);
dIContainer
  .bind<IUserPrismaQueryRaw>(PrismaQueryRawDITypes.USER)
  .to(UserPrismaQueryRaw);
dIContainer
  .bind<ICoursePrismaQueryRaw>(PrismaQueryRawDITypes.COURSE)
  .to(CoursePrismaQueryRaw);
dIContainer
  .bind<ICourseCategoryPrismaQueryRaw>(PrismaQueryRawDITypes.COURSE_CATEGORY)
  .to(CourseCategoryPrismaQueryRaw);
dIContainer
  .bind<ICourseEnrollmentPrismaQueryRaw>(
    PrismaQueryRawDITypes.COURSE_ENROLLMENT,
  )
  .to(CourseEnrollmentPrismaQueryRaw);
dIContainer
  .bind<ICourseLessonPrismaQueryRaw>(PrismaQueryRawDITypes.COURSE_LESSON)
  .to(CourseLessonPrismaQueryRaw);
dIContainer
  .bind<ICourseLessonVideoPrismaQueryRaw>(
    PrismaQueryRawDITypes.COURSE_LESSON_VIDEO,
  )
  .to(CourseLessonVideoPrismaQueryRaw);

/**
 * PrismaPromise
 *
 */
dIContainer
  .bind<IPrismaPromise>(PrismaPromiseDITypes.PRISMA_PROMISE)
  .to(PrismaPromise);
dIContainer
  .bind<ICoursePrismaPromise>(PrismaPromiseDITypes.COURSE)
  .to(CoursePrismaPromise);

/**
 * PrismaTable Container
 *
 */
dIContainer.bind<ITable>(PrismaTableDITypes.TABLE).to(PrismaTable);
dIContainer.bind<ICourseTable>(PrismaTableDITypes.COURSE).to(PrismaCourseTable);
dIContainer
  .bind<ICourseEnrollmentTable>(PrismaTableDITypes.COURSE_ENROLLMENT)
  .to(PrismaCourseEnrollmentTable);
dIContainer
  .bind<ICourseLessonTable>(PrismaTableDITypes.COURSE_LESSON)
  .to(PrismaCourseLessonTable);
dIContainer
  .bind<ICourseLessonVideoTable>(PrismaTableDITypes.COURSE_LESSON_VIDEO)
  .to(PrismaCourseLessonVideoTable);
dIContainer
  .bind<ICourseLikeTable>(PrismaTableDITypes.COURSE_LIKE)
  .to(PrismaCourseLikeTable);

/**
 * User Container
 *
 */
// dIContainer.bind<IUserRepository>(UserDITypes.REPOSITORY).to(UserRepository);
// dIContainer.bind<IUserService>(UserDITypes.SERVICE).to(UserService);
// dIContainer.bind<IUserController>(UserDITypes.CONTROLLER).to(UserController);

/**
 * Course Container
 *
 */
dIContainer
  .bind<ICourseRepository>(CourseDITypes.REPOSITORY)
  .to(CourseRepository);
dIContainer.bind<ICourseService>(CourseDITypes.SERVICE).to(CourseService);
dIContainer
  .bind<ICourseController>(CourseDITypes.CONTROLLER)
  .to(CourseController);
dIContainer
  .bind<ICourseAuthorizationMiddleware>(CourseDITypes.AUTHORIZATION_MIDDLEWARE)
  .to(CourseAuthorizationMiddleware);

/**
 * Course Category
 *
 */
dIContainer
  .bind<ICourseCategoryRepository>(CourseCategoryDITypes.REPOSITORY)
  .to(CourseCategoryRepository);
dIContainer
  .bind<ICourseCategoryService>(CourseCategoryDITypes.SERVICE)
  .to(CourseCategoryService);
dIContainer
  .bind<ICourseCategoryController>(CourseCategoryDITypes.CONTROLLER)
  .to(CourseCategoryController);
dIContainer
  .bind<ICourseCategoryAuthorization>(CourseCategoryDITypes.AUTHORIZATION)
  .to(CourseCategoryAuthorization);

/**
 * Course Enrollment
 *
 */
dIContainer
  .bind<ICourseEnrollmentRepository>(CourseEnrollmentDITypes.REPOSITORY)
  .to(CourseEnrollmentRepository);
dIContainer
  .bind<ICourseEnrollmentService>(CourseEnrollmentDITypes.SERVICE)
  .to(CourseEnrollmentService);
dIContainer
  .bind<ICourseEnrollmentController>(CourseEnrollmentDITypes.CONTROLLER)
  .to(CourseEnrollmentController);
dIContainer
  .bind<CourseEnrollmentAuthorization>(CourseEnrollmentDITypes.AUTHORIZATION)
  .to(CourseEnrollmentAuthorization);

/**
 * Course Lesson
 *
 */
dIContainer
  .bind<ICourseLessonRepository>(CourseLessonDITypes.REPOSITORY)
  .to(CourseLessonRepository);
dIContainer
  .bind<ICourseLessonService>(CourseLessonDITypes.SERVICE)
  .to(CourseLessonService);
dIContainer
  .bind<ICourseLessonController>(CourseLessonDITypes.CONTROLLER)
  .to(CourseLessonController);
dIContainer
  .bind<ICourseLessonAuthorization>(CourseLessonDITypes.AUTHORIZATION)
  .to(CourseLessonAuthorization);

/**
 * Course Lesson Video
 *
 */
dIContainer
  .bind<ICourseLessonVideoRepository>(CourseLessonVideoDITypes.REPOSITORY)
  .to(CourseLessonVideoRepository);
dIContainer
  .bind<ICourseLessonVideoService>(CourseLessonVideoDITypes.SERVICE)
  .to(CourseLessonVideoService);
dIContainer
  .bind<ICourseLessonVideoController>(CourseLessonVideoDITypes.CONTROLLER)
  .to(CourseLessonVideoController);
dIContainer
  .bind<ICourseLessonVideoAuthorization>(CourseLessonVideoDITypes.AUTHORIZATION)
  .to(CourseLessonVideoAuthorization);

export default dIContainer;
