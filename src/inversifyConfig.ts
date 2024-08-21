import "reflect-metadata";
import { Container } from "inversify";
import { UserDITypes } from "./modules/user/user.type";
import { CourseDITypes } from "./modules/course/course.type";
import { CourseEnrollmentDITypes } from "./modules/enrollment/enrollment.type";
import CourseEnrollmentRepository from "./modules/enrollment/repository/enrollment.repository";
import { CourseLessonDITypes } from "./modules/lesson/lesson.type";
import { CourseLessonVideoDITypes } from "./modules/video/video.type";
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
  IDepartmentPrismaQueryRaw,
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
  IRepository,
  RepositoryDITypes,
} from "./common/class/repository/repository.type";
import Repository from "./common/class/repository/Repository";
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
import {
  ICourseLessonVideoAuthorization,
  ICourseLessonVideoController,
  ICourseLessonVideoRepository,
  ICourseLessonVideoService,
} from "./modules/video/video.interface";
import CourseLessonVideoRepository from "./modules/video/repository/video.repository";
import CourseLessonVideoService from "./modules/video/service/video.service";
import CourseLessonVideoController from "./modules/video/controller/video.controller";
import {
  IPersonalAssignmentAuthorization,
  IPersonalAssignmentController,
  IPersonalAssignmentRepository,
  IPersonalAssignmentService,
} from "./modules/personal-assignment/assignment.interface";
import { PersonalAssignmentDITypes } from "./modules/personal-assignment/assignment.type";
import PersonalAssignmentRepository from "./modules/personal-assignment/repository/assignment.repository";
import PersonalAssignmentService from "./modules/personal-assignment/service/assignment.service";
import PersonalAssignmentController from "./modules/personal-assignment/controller/assignment.controller";
import PersonalAssignmentAuthorization from "./modules/personal-assignment/authorization/assignment.authorization";
import {
  ICompetitionAuthorization,
  ICompetitionController,
  ICompetitionRepository,
  ICompetitionService,
} from "./modules/competition/competition.interface";
import CompetitionRepository from "./modules/competition/repository/competition.repository";
import CompetitionService from "./modules/competition/service/competition.service";
import CompetitionController from "./modules/competition/controller/competition.controller";
import { CompetitionDITypes } from "./modules/competition/competition.type";
import CompetitionAuthorization from "./modules/competition/authorization/competition.authorization";
import {
  ICourseScheduleAuthorization,
  ICourseScheduleController,
  ICourseScheduleRepository,
  ICourseScheduleService,
} from "./modules/schedule/schedule.interface";
import CourseScheduleRepository from "./modules/schedule/repository/schedule.repository";
import CourseScheduleService from "./modules/schedule/service/schedule.service";
import CourseScheduleAuthorization from "./modules/schedule/authorization/schedule.authorization";
import { CourseScheduleDITypes } from "./modules/schedule/schedule.type";
import {
  IDepartmentAuthorization,
  IDepartmentController,
  IDepartmentRepository,
  IDepartmentService,
} from "./modules/department/department.interface";
import DepartmentRepository from "./modules/department/repository/department.repository";
import DepartmentService from "./modules/department/service/department.service";
import DepartmentController from "./modules/department/controller/department.controller";
import DepartmentAuthorization from "./modules/department/authorization/department.authorization";
import { DepartmentDITypes } from "./modules/department/department.type";
import {
  IDepartmentDivisionAuthorization,
  IDepartmentDivisionController,
  IDepartmentDivisionRepository,
  IDepartmentDivisionService,
} from "./modules/division/division.interface";
import { DepartmentDivisionDITypes } from "./modules/division/division.type";
import DepartmentDivisionRepository from "./modules/division/repository/division.repository";
import DepartmentDivisionService from "./modules/division/service/division.service";
import DepartmentDivisionController from "./modules/division/controller/division.controller";
import DepartmentDivisionAuthorization from "./modules/division/authorization/division.authorization";
import {
  IDepartmentDivisionEnrollmentAuthorization,
  IDepartmentDivisionEnrollmentController,
  IDepartmentDivisionEnrollmentRepository,
  IDepartmentDivisionEnrollmentService,
} from "./modules/division-enrollment/enrollment.interface";
import { DepartmentDivisionEnrollmentDITypes } from "./modules/division-enrollment/enrollment.type";
import DepartmentDivisionEnrollmentRepository from "./modules/division-enrollment/repository/enrollment.repository";
import DepartmentDivisionEnrollmentService from "./modules/division-enrollment/service/enrollment.service";
import DepartmentDivisionEnrollmentController from "./modules/division-enrollment/controller/enrollment.controller";
import DepartmentDivisionEnrollmentAuthorization from "./modules/division-enrollment/authorization/enrollment.authorization";
import {
  IDepartmentProgramEnrollmentAuthorization,
  IDepartmentProgramEnrollmentController,
  IDepartmentProgramEnrollmentRepository,
  IDepartmentProgramEnrollmentService,
} from "./modules/program-enrollment/enrollment.interface";
import DepartmentProgramEnrollmentRepository from "./modules/program-enrollment/repository/enrollment.repository";
import DepartmentProgramEnrollmentService from "./modules/program-enrollment/service/enrollment.service";
import DepartmentProgramEnrollmentController from "./modules/program-enrollment/controller/enrollment.controller";
import DepartmentProgramEnrollmentAuthorization from "./modules/program-enrollment/authorization/enrollment.authorization";
import { DepartmentProgramEnrollmentDITypes } from "./modules/program-enrollment/enrollment.type";
import {
  IReportAuthorization,
  IReportController,
  IReportRepository,
  IReportService,
} from "./modules/report/report.interface";
import { ReportDITypes } from "./modules/report/report.type";
import ReportRepository from "./modules/report/repository/report.repository";
import ReportService from "./modules/report/service/report.service";
import ReportController from "./modules/report/controller/report.controller";
import ReportAuthorization from "./modules/report/authorization/report.authorization";
import {
  IScholarshipAuthorization,
  IScholarshipController,
  IScholarshipRepository,
  IScholarshipService,
} from "./modules/scholarship/scholarship.interface";
import ScholarshipRepository from "./modules/scholarship/repository/scholarship.repository";
import ScholarshipService from "./modules/scholarship/service/scholarship.service";
import ScholarshipController from "./modules/scholarship/controller/scholarship.controller";
import ScholarshipAuthorization from "./modules/scholarship/authorization/scholarship.authorization";
import { ScholarshipDITypes } from "./modules/scholarship/scholarship.type";
import CourseScheduleController from "./modules/schedule/controller/schedule.controller";
import DepartmentPrismaQueryRaw from "./common/class/prisma_query_raw/DepartmentPrismaQueryRaw";
import { CourseClassAssignmentCompletionDITypes } from "./modules/assignment-completion/completion.type";
import {
  ICourseClassAssignmentCompletionAuthorization,
  ICourseClassAssignmentCompletionController,
  ICourseClassAssignmentCompletionRepository,
  ICourseClassAssignmentCompletionService,
} from "./modules/assignment-completion/completion.interface";
import CourseClassAssigmentCompletionRepository from "./modules/assignment-completion/repository/completion.repository";
import CourseClassAssignmentCompletionService from "./modules/assignment-completion/service/completion.service";
import CourseClassAssignmentCompletionAuthorization from "./modules/assignment-completion/authorization/completion.authorization";
import CompletionController from "./modules/assignment-completion/controller/completion.controller";
import {
  IDepartmentProgramAuthorization,
  IDepartmentProgramController,
  IDepartmentProgramRepository,
  IDepartmentProgramService,
} from "./modules/program/program.interface";
import { DepartmentProgramDITypes } from "./modules/program/program.type";
import DepartmentProgramRepository from "./modules/program/repository/program.repository";
import DepartmentProgramService from "./modules/program/service/program.service";
import DepartmentProgramController from "./modules/program/controller/program.controller";
import DepartmentProgramAuthorization from "./modules/program/authorization/program.authorization";

const dIContainer = new Container();

/**
 * Repository
 *
 */
dIContainer.bind<IRepository>(RepositoryDITypes.FACADE).to(Repository);

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
dIContainer
  .bind<IDepartmentPrismaQueryRaw>(PrismaQueryRawDITypes.DEPARTMENT)
  .to(DepartmentPrismaQueryRaw);

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
 * PersonalAssignment Container
 *
 */
dIContainer
  .bind<IPersonalAssignmentRepository>(PersonalAssignmentDITypes.REPOSITORY)
  .to(PersonalAssignmentRepository);
dIContainer
  .bind<IPersonalAssignmentService>(PersonalAssignmentDITypes.SERVICE)
  .to(PersonalAssignmentService);
dIContainer
  .bind<IPersonalAssignmentController>(PersonalAssignmentDITypes.CONTROLLER)
  .to(PersonalAssignmentController);
dIContainer
  .bind<IPersonalAssignmentAuthorization>(
    PersonalAssignmentDITypes.AUTHORIZATION,
  )
  .to(PersonalAssignmentAuthorization);

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
 * Course Class Assignment Completion
 *
 */
dIContainer
  .bind<ICourseClassAssignmentCompletionRepository>(
    CourseClassAssignmentCompletionDITypes.REPOSITORY,
  )
  .to(CourseClassAssigmentCompletionRepository);
dIContainer
  .bind<ICourseClassAssignmentCompletionService>(
    CourseClassAssignmentCompletionDITypes.SERVICE,
  )
  .to(CourseClassAssignmentCompletionService);
dIContainer
  .bind<ICourseClassAssignmentCompletionController>(
    CourseClassAssignmentCompletionDITypes.CONTROLLER,
  )
  .to(CompletionController);
dIContainer
  .bind<ICourseClassAssignmentCompletionAuthorization>(
    CourseClassAssignmentCompletionDITypes.AUTHORIZATION,
  )
  .to(CourseClassAssignmentCompletionAuthorization);

/**
 * Course Schedule
 *
 */
dIContainer
  .bind<ICourseScheduleRepository>(CourseScheduleDITypes.REPOSITORY)
  .to(CourseScheduleRepository);
dIContainer
  .bind<ICourseScheduleService>(CourseScheduleDITypes.SERVICE)
  .to(CourseScheduleService);
dIContainer
  .bind<ICourseScheduleController>(CourseScheduleDITypes.CONTROLLER)
  .to(CourseScheduleController);
dIContainer
  .bind<ICourseScheduleAuthorization>(CourseScheduleDITypes.AUTHORIZATION)
  .to(CourseScheduleAuthorization);

/**
 * Department
 *
 */
dIContainer
  .bind<IDepartmentRepository>(DepartmentDITypes.REPOSITORY)
  .to(DepartmentRepository);
dIContainer
  .bind<IDepartmentService>(DepartmentDITypes.SERVICE)
  .to(DepartmentService);
dIContainer
  .bind<IDepartmentController>(DepartmentDITypes.CONTROLLER)
  .to(DepartmentController);
dIContainer
  .bind<IDepartmentAuthorization>(DepartmentDITypes.AUTHORIZATION)
  .to(DepartmentAuthorization);

/**
 * Department Division
 *
 */
dIContainer
  .bind<IDepartmentDivisionRepository>(DepartmentDivisionDITypes.REPOSITORY)
  .to(DepartmentDivisionRepository);
dIContainer
  .bind<IDepartmentDivisionService>(DepartmentDivisionDITypes.SERVICE)
  .to(DepartmentDivisionService);
dIContainer
  .bind<IDepartmentDivisionController>(DepartmentDivisionDITypes.CONTROLLER)
  .to(DepartmentDivisionController);
dIContainer
  .bind<IDepartmentDivisionAuthorization>(
    DepartmentDivisionDITypes.AUTHORIZATION,
  )
  .to(DepartmentDivisionAuthorization);

/**
 * Department Division Enrollment
 *
 */
dIContainer
  .bind<IDepartmentDivisionEnrollmentRepository>(
    DepartmentDivisionEnrollmentDITypes.REPOSITORY,
  )
  .to(DepartmentDivisionEnrollmentRepository);
dIContainer
  .bind<IDepartmentDivisionEnrollmentService>(
    DepartmentDivisionEnrollmentDITypes.SERVICE,
  )
  .to(DepartmentDivisionEnrollmentService);
dIContainer
  .bind<IDepartmentDivisionEnrollmentController>(
    DepartmentDivisionEnrollmentDITypes.CONTROLLER,
  )
  .to(DepartmentDivisionEnrollmentController);
dIContainer
  .bind<IDepartmentDivisionEnrollmentAuthorization>(
    DepartmentDivisionEnrollmentDITypes.AUTHORIZATION,
  )
  .to(DepartmentDivisionEnrollmentAuthorization);

/**
 * Department Division Program
 *
 */
dIContainer
  .bind<IDepartmentProgramRepository>(DepartmentProgramDITypes.REPOSITORY)
  .to(DepartmentProgramRepository);
dIContainer
  .bind<IDepartmentProgramService>(DepartmentProgramDITypes.SERVICE)
  .to(DepartmentProgramService);
dIContainer
  .bind<IDepartmentProgramController>(DepartmentProgramDITypes.CONTROLLER)
  .to(DepartmentProgramController);
dIContainer
  .bind<IDepartmentProgramAuthorization>(DepartmentProgramDITypes.AUTHORIZATION)
  .to(DepartmentProgramAuthorization);

/**
 * Department Division Program Enrollment
 *
 */
dIContainer
  .bind<IDepartmentProgramEnrollmentRepository>(
    DepartmentProgramEnrollmentDITypes.REPOSITORY,
  )
  .to(DepartmentProgramEnrollmentRepository);
dIContainer
  .bind<IDepartmentProgramEnrollmentService>(
    DepartmentProgramEnrollmentDITypes.SERVICE,
  )
  .to(DepartmentProgramEnrollmentService);
dIContainer
  .bind<IDepartmentProgramEnrollmentController>(
    DepartmentProgramEnrollmentDITypes.CONTROLLER,
  )
  .to(DepartmentProgramEnrollmentController);
dIContainer
  .bind<IDepartmentProgramEnrollmentAuthorization>(
    DepartmentProgramEnrollmentDITypes.AUTHORIZATION,
  )
  .to(DepartmentProgramEnrollmentAuthorization);

/**
 * Report
 *
 */
dIContainer
  .bind<IReportRepository>(ReportDITypes.REPOSITORY)
  .to(ReportRepository);
dIContainer.bind<IReportService>(ReportDITypes.SERVICE).to(ReportService);
dIContainer
  .bind<IReportController>(ReportDITypes.CONTROLLER)
  .to(ReportController);
dIContainer
  .bind<IReportAuthorization>(ReportDITypes.AUTHORIZATION)
  .to(ReportAuthorization);

/**
 * Scholarship
 *
 */
dIContainer
  .bind<IScholarshipRepository>(ScholarshipDITypes.REPOSITORY)
  .to(ScholarshipRepository);
dIContainer
  .bind<IScholarshipService>(ScholarshipDITypes.SERVICE)
  .to(ScholarshipService);
dIContainer
  .bind<IScholarshipController>(ScholarshipDITypes.CONTROLLER)
  .to(ScholarshipController);
dIContainer
  .bind<IScholarshipAuthorization>(ScholarshipDITypes.AUTHORIZATION)
  .to(ScholarshipAuthorization);

/**
 * Competition
 *
 */
dIContainer
  .bind<ICompetitionRepository>(CompetitionDITypes.REPOSITORY)
  .to(CompetitionRepository);
dIContainer
  .bind<ICompetitionService>(CompetitionDITypes.SERVICE)
  .to(CompetitionService);
dIContainer
  .bind<ICompetitionController>(CompetitionDITypes.CONTROLLER)
  .to(CompetitionController);
dIContainer
  .bind<ICompetitionAuthorization>(CompetitionDITypes.AUTHORIZATION)
  .to(CompetitionAuthorization);

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
