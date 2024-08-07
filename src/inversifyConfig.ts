import "reflect-metadata";
import { Container } from "inversify";
import { UserDITypes } from "./modules/user/user.type";
import { CourseDITypes } from "./modules/course/course.type";
import { CourseEnrollmentDITypes } from "./modules/enrollment/enrollment.type";
import CourseEnrollmentRepository from "./modules/enrollment/repository/enrollment.repository";
import { CourseLessonDITypes } from "./modules/lesson/lesson.type";
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
import CourseCategoryRepository from "./modules/category/repository/category.repository";
import { CourseCategoryDITypes } from "./modules/category/category.type";
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
import {
  ICourseCategoryRandDB,
  ICourseEnrollmentRandDB,
  ICourseLessonRandDB,
  ICourseLessonVideoRandBD,
  ICourseRandDB,
  IRandDB,
  IUserRandDB,
  PrismaRandDBDITypes,
} from "./common/class/randprisma/rand.type";
import PrismaRandDB from "./common/class/randprisma/RandPrisma";
import PrismaUserRandDB from "./common/class/randprisma/PrismaUserRandDB";
import PrismaCourseRandDB from "./common/class/randprisma/PrismaCourseRandDB";
import PrismaCourseCategoryRandDB from "./common/class/randprisma/PrismaCourseCategoryRandDB";
import PrismaCourseLessonRandDB from "./common/class/randprisma/PrismaCourseLessonRandDB";
import PrismaCourseLessonVideoRandDB from "./common/class/randprisma/PrismaCourseLessonVideoRandDB";
import PrismaCourseEnrollmentRandDB from "./common/class/randprisma/PrismaCourseEnrollmentRandDB";
import {
  ICourseLessonRandDTO,
  ICourseLessonVideoRandDTO,
  ICourseRandDTO,
  IRandDTO,
  IUserRandDTO,
  RandDTODITypes,
} from "./common/class/rand_dto/rand_dto.type";
import RandDTO from "./common/class/rand_dto/RandDTO";
import UserRandDTO from "./common/class/rand_dto/UserRandDTO";
import CourseRandDTO from "./common/class/rand_dto/CourseRandDTO";
import {
  IRepository,
  RepositoryDITypes,
} from "./common/class/repository/repository.type";
import Repository from "./common/class/repository/Repository";
import CourseLessonRandDTO from "./common/class/rand_dto/CourseLessonRandDTO";
import CourseLessonVideoRandDTO from "./common/class/rand_dto/CourseLessonVideoRandDTO";
import BaseAuthorization, {
  BaseAuthorizationDITypes,
} from "./common/class/BaseAuthorization";
import UserAuthorization from "./modules/user/authorization/user.authorization";
import { CourseClassDITypes } from "./modules/class/class.type";
import CourseClassRepository from "./modules/class/repository/class.repository";
import CourseClassService from "./modules/class/service/class.service";
import CourseClassController from "./modules/class/controller/class.controller";
import CourseClassAuthorization from "./modules/class/authorization/class.authorization";
import { CourseClassAssignmentDITypes } from "./modules/assignment/assignment.type";
import {
  ICourseClassAssignmentAuthorization,
  ICourseClassAssignmentController,
  ICourseClassAssignmentRepository,
  ICourseClassAssignmentService,
} from "./modules/assignment/assignment.interface";
import CourseClassAssignmentRepository from "./modules/assignment/repository/assignment.repository";
import CourseClassAssignmentService from "./modules/assignment/service/assignment.service";
import CourseClassAssignmentController from "./modules/assignment/controller/assignment.controller";
import CourseClassAssignmentAuthorization from "./modules/assignment/authorization/assignment.authorization";
import { EventDITypes } from "./modules/event/event.type";
import EventRepository from "./modules/event/repository/event.repository";
import EventService from "./modules/event/service/event.service";
import EventController from "./modules/event/controller/event.controller";
import EventAuthorization from "./modules/event/authorization/event.authorization";
import {
  ICourseCategoryAuthorization,
  ICourseCategoryController,
  ICourseCategoryRepository,
  ICourseCategoryService,
} from "./modules/category/category.interface";
import CourseCategoryService from "./modules/category/service/category.service";
import CourseCategoryController from "./modules/category/controller/category.controller";
import {
  ICourseAuthorization,
  ICourseController,
  ICourseRepository,
  ICourseService,
} from "./modules/course/course.interface";
import CourseRepository from "./modules/course/repository/course.repository";
import CourseService from "./modules/course/service/course.service";
import CourseController from "./modules/course/controller/course.controller";
import CourseAuthorization from "./modules/course/authorization/course.authorization";
import {
  ICourseClassAuthorization,
  ICourseClassController,
  ICourseClassRepository,
  ICourseClassService,
} from "./modules/class/class.interface";
import {
  ICourseEnrollmentController,
  ICourseEnrollmentRepository,
  ICourseEnrollmentService,
} from "./modules/enrollment/enrollment.interface";
import CourseEnrollmentService from "./modules/enrollment/service/enrollment.service";
import CourseEnrollmentController from "./modules/enrollment/controller/enrollment.controller";
import {
  ICourseLessonAuthorization,
  ICourseLessonController,
  ICourseLessonRepository,
  ICourseLessonService,
} from "./modules/lesson/lesson.interface";
import CourseLessonRepository from "./modules/lesson/repository/lesson.repository";
import CourseLessonService from "./modules/lesson/service/lesson.service";
import CourseLessonController from "./modules/lesson/controller/lesson.controller";
import {
  IEventAuthorization,
  IEventController,
  IEventRepository,
  IEventService,
} from "./modules/event/event.interface";
import {
  IUserAuthorization,
  IUserController,
  IUserRepository,
  IUserService,
} from "./modules/user/user.interface";
import UserRepository from "./modules/user/repository/user.repository";
import UserService from "./modules/user/service/user.service";
import UserController from "./modules/user/controller/user.controller";

const dIContainer = new Container();

/**
 * Repository
 *
 */
dIContainer.bind<IRepository>(RepositoryDITypes.FACADE).to(Repository);

/**
 * RandDTO
 *
 */
dIContainer.bind<IRandDTO>(RandDTODITypes.FACADE).to(RandDTO);
dIContainer.bind<IUserRandDTO>(RandDTODITypes.USER).to(UserRandDTO);
dIContainer.bind<ICourseRandDTO>(RandDTODITypes.COURSE).to(CourseRandDTO);
dIContainer
  .bind<ICourseLessonRandDTO>(RandDTODITypes.COURSE_LESSON)
  .to(CourseLessonRandDTO);
dIContainer
  .bind<ICourseLessonVideoRandDTO>(RandDTODITypes.COURSE_LESSON_VIDEO)
  .to(CourseLessonVideoRandDTO);

/**
 * PrismaRandDB
 *
 */
dIContainer.bind<IRandDB>(PrismaRandDBDITypes.FACADE).to(PrismaRandDB);
dIContainer.bind<IUserRandDB>(PrismaRandDBDITypes.USER).to(PrismaUserRandDB);
dIContainer
  .bind<ICourseRandDB>(PrismaRandDBDITypes.COURSE)
  .to(PrismaCourseRandDB);
dIContainer
  .bind<ICourseCategoryRandDB>(PrismaRandDBDITypes.COURSE_CATEGORY)
  .to(PrismaCourseCategoryRandDB);
dIContainer
  .bind<ICourseEnrollmentRandDB>(PrismaRandDBDITypes.COURSE_ENROLLMENT)
  .to(PrismaCourseEnrollmentRandDB);
dIContainer
  .bind<ICourseLessonRandDB>(PrismaRandDBDITypes.COURSE_LESSON)
  .to(PrismaCourseLessonRandDB);
dIContainer
  .bind<ICourseLessonVideoRandBD>(PrismaRandDBDITypes.COURSE_LESSON_VIDEO)
  .to(PrismaCourseLessonVideoRandDB);

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
dIContainer.bind<IUserRepository>(UserDITypes.REPOSITORY).to(UserRepository);
dIContainer.bind<IUserService>(UserDITypes.SERVICE).to(UserService);
dIContainer.bind<IUserController>(UserDITypes.CONTROLLER).to(UserController);
dIContainer
  .bind<IUserAuthorization>(UserDITypes.AUTHORIZATION)
  .to(UserAuthorization);

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
  .bind<ICourseAuthorization>(CourseDITypes.AUTHORIZATION)
  .to(CourseAuthorization);

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

/**
 * Course Class
 *
 */
dIContainer
  .bind<ICourseClassRepository>(CourseClassDITypes.REPOSITORY)
  .to(CourseClassRepository);
dIContainer
  .bind<ICourseClassService>(CourseClassDITypes.SERVICE)
  .to(CourseClassService);
dIContainer
  .bind<ICourseClassController>(CourseClassDITypes.CONTROLLER)
  .to(CourseClassController);
dIContainer
  .bind<ICourseClassAuthorization>(CourseClassDITypes.AUTHORIZATION)
  .to(CourseClassAuthorization);

/**
 * Course Class Assignment
 *
 */
dIContainer
  .bind<ICourseClassAssignmentRepository>(
    CourseClassAssignmentDITypes.REPOSITORY,
  )
  .to(CourseClassAssignmentRepository);
dIContainer
  .bind<ICourseClassAssignmentService>(CourseClassAssignmentDITypes.SERVICE)
  .to(CourseClassAssignmentService);
dIContainer
  .bind<ICourseClassAssignmentController>(
    CourseClassAssignmentDITypes.CONTROLLER,
  )
  .to(CourseClassAssignmentController);
dIContainer
  .bind<ICourseClassAssignmentAuthorization>(
    CourseClassAssignmentDITypes.AUTHORIZATION,
  )
  .to(CourseClassAssignmentAuthorization);

/**
 * Event
 *
 */
dIContainer.bind<IEventRepository>(EventDITypes.REPOSITORY).to(EventRepository);
dIContainer.bind<IEventService>(EventDITypes.SERVICE).to(EventService);
dIContainer.bind<IEventController>(EventDITypes.CONTROLLER).to(EventController);
dIContainer
  .bind<IEventAuthorization>(EventDITypes.AUTHORIZATION)
  .to(EventAuthorization);

/**
 * Common
 *
 */
dIContainer
  .bind<BaseAuthorization>(BaseAuthorizationDITypes)
  .to(BaseAuthorization);

export default dIContainer;
