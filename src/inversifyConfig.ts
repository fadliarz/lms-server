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
import { PrismaClient } from "@prisma/client";
import { databaseDITypes } from "./common/constants/databaseDITypes";
import {
  CourseAuthorizationMiddleware,
  ICourseAuthorizationMiddleware,
} from "./modules/course/authorization/course.authorization";
import {
  CourseEnrollmentController,
  ICourseEnrollmentController,
} from "./modules/enrollment/controller/enrollment.controller";
import { CourseEnrollmentDITypes } from "./modules/enrollment/enrollment.type";
import {
  CourseEnrollmentService,
  ICourseEnrollmentService,
} from "./modules/enrollment/service/enrollment.service";
import {
  CourseEnrollmentRepository,
  ICourseEnrollmentRepository,
} from "./modules/enrollment/repository/enrollment.repository";
import {
  CourseEnrollmentAuthorizationMiddleware,
  ICourseEnrollmentAuthorizationMiddleware,
} from "./modules/enrollment/authorization/enrollment.authorization";
import {
  CourseLessonRepository,
  ICourseLessonRepository,
} from "./modules/lesson/repository/lesson.repository";
import { CourseLessonDITypes } from "./modules/lesson/lesson.type";
import {
  CourseLessonService,
  ICourseLessonService,
} from "./modules/lesson/service/lesson.service";
import {
  CourseLessonController,
  ICourseLessonController,
} from "./modules/lesson/controller/lesson.controller";
import { CourseLessonVideoController } from "./modules/video/controller/video.controller";

const dIContainer = new Container();

/**
 * Prisma
 */
dIContainer.bind<PrismaClient>(databaseDITypes.PRISMA_CLIENT).to(PrismaClient);

/**
 * User Container
 */
dIContainer
  .bind<IUserRepository>(UserDITypes.USER_REPOSITORY)
  .to(UserRepository);
dIContainer.bind<IUserService>(UserDITypes.USER_SERVICE).to(UserService);
dIContainer
  .bind<IUserController>(UserDITypes.USER_CONTROLLER)
  .to(UserController);

/**
 * Course Container
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
 * Course Enrollment
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
  .bind<ICourseEnrollmentAuthorizationMiddleware>(
    CourseEnrollmentDITypes.AUTHORIZATION_MIDDLEARE
  )
  .to(CourseEnrollmentAuthorizationMiddleware);

/**
 * Course Lesson
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

export default dIContainer;
