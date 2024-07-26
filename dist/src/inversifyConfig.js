"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const user_controller_1 = require("./modules/user/controller/user.controller");
const user_repository_1 = require("./modules/user/repository/user.repository");
const user_service_1 = require("./modules/user/service/user.service");
const user_type_1 = require("./modules/user/user.type");
const course_controller_1 = require("./modules/course/controller/course.controller");
const course_service_1 = require("./modules/course/service/course.service");
const course_repository_1 = require("./modules/course/repository/course.repository");
const course_type_1 = require("./modules/course/course.type");
const enrollment_controller_1 = require("./modules/enrollment/controller/enrollment.controller");
const enrollment_type_1 = require("./modules/enrollment/enrollment.type");
const enrollment_service_1 = require("./modules/enrollment/service/enrollment.service");
const enrollment_repository_1 = __importDefault(require("./modules/enrollment/repository/enrollment.repository"));
const lesson_repository_1 = require("./modules/lesson/repository/lesson.repository");
const lesson_type_1 = require("./modules/lesson/lesson.type");
const lesson_service_1 = require("./modules/lesson/service/lesson.service");
const lesson_controller_1 = require("./modules/lesson/controller/lesson.controller");
const video_repository_1 = require("./modules/video/repository/video.repository");
const video_type_1 = require("./modules/video/video.type");
const video_service_1 = require("./modules/video/service/video.service");
const video_controller_1 = require("./modules/video/controller/video.controller");
const category_repository_1 = require("./modules/category/repository/category.repository");
const category_service_1 = require("./modules/category/service/category.service");
const category_controller_1 = require("./modules/category/controller/category.controller");
const category_type_1 = require("./modules/category/category.type");
const PrismaTable_1 = __importStar(require("./common/class/table/PrismaTable"));
const PrismaCourseTable_1 = __importDefault(require("./common/class/table/PrismaCourseTable"));
const PrismaCourseEnrollmentTable_1 = __importDefault(require("./common/class/table/PrismaCourseEnrollmentTable"));
const PrismaCourseLessonTable_1 = __importDefault(require("./common/class/table/PrismaCourseLessonTable"));
const PrismaCourseLessonVideoTable_1 = __importDefault(require("./common/class/table/PrismaCourseLessonVideoTable"));
const PrismaCourseLikeTable_1 = __importDefault(require("./common/class/table/PrismaCourseLikeTable"));
const enrollment_authorization_1 = __importDefault(require("./modules/enrollment/authorization/enrollment.authorization"));
const prisma_promise_type_1 = require("./common/class/prisma_promise/prisma_promise.type");
const PrismaPromise_1 = __importDefault(require("./common/class/prisma_promise/PrismaPromise"));
const CoursePrismaPromise_1 = __importDefault(require("./common/class/prisma_promise/CoursePrismaPromise"));
const prisma_query_raw_type_1 = require("./common/class/prisma_query_raw/prisma_query_raw.type");
const PrismaQueryRaw_1 = __importDefault(require("./common/class/prisma_query_raw/PrismaQueryRaw"));
const UserPrismaQueryRaw_1 = __importDefault(require("./common/class/prisma_query_raw/UserPrismaQueryRaw"));
const CoursePrismaQueryRaw_1 = __importDefault(require("./common/class/prisma_query_raw/CoursePrismaQueryRaw"));
const CourseEnrollmentPrismaQueryRaw_1 = __importDefault(require("./common/class/prisma_query_raw/CourseEnrollmentPrismaQueryRaw"));
const CourseLessonPrismaQueryRaw_1 = __importDefault(require("./common/class/prisma_query_raw/CourseLessonPrismaQueryRaw"));
const lesson_authorization_1 = __importDefault(require("./modules/lesson/authorization/lesson.authorization"));
const video_authorization_1 = __importDefault(require("./modules/video/authorization/video.authorization"));
const CourseLessonVideoPrismaQueryRaw_1 = __importDefault(require("./common/class/prisma_query_raw/CourseLessonVideoPrismaQueryRaw"));
const category_authorization_1 = __importDefault(require("./modules/category/authorization/category.authorization"));
const CourseCategoryPrismaQueryRaw_1 = __importDefault(require("./common/class/prisma_query_raw/CourseCategoryPrismaQueryRaw"));
const rand_type_1 = require("./common/class/randprisma/rand.type");
const RandPrisma_1 = __importDefault(require("./common/class/randprisma/RandPrisma"));
const PrismaUserRandDB_1 = __importDefault(require("./common/class/randprisma/PrismaUserRandDB"));
const PrismaCourseRandDB_1 = __importDefault(require("./common/class/randprisma/PrismaCourseRandDB"));
const PrismaCourseCategoryRandDB_1 = __importDefault(require("./common/class/randprisma/PrismaCourseCategoryRandDB"));
const PrismaCourseLessonRandDB_1 = __importDefault(require("./common/class/randprisma/PrismaCourseLessonRandDB"));
const PrismaCourseLessonVideoRandDB_1 = __importDefault(require("./common/class/randprisma/PrismaCourseLessonVideoRandDB"));
const PrismaCourseEnrollmentRandDB_1 = __importDefault(require("./common/class/randprisma/PrismaCourseEnrollmentRandDB"));
const rand_dto_type_1 = require("./common/class/rand_dto/rand_dto.type");
const RandDTO_1 = __importDefault(require("./common/class/rand_dto/RandDTO"));
const UserRandDTO_1 = __importDefault(require("./common/class/rand_dto/UserRandDTO"));
const CourseRandDTO_1 = __importDefault(require("./common/class/rand_dto/CourseRandDTO"));
const repository_type_1 = require("./common/class/repository/repository.type");
const Repository_1 = __importDefault(require("./common/class/repository/Repository"));
const course_authorization_1 = require("./modules/course/authorization/course.authorization");
const CourseLessonRandDTO_1 = __importDefault(require("./common/class/rand_dto/CourseLessonRandDTO"));
const CourseLessonVideoRandDTO_1 = __importDefault(require("./common/class/rand_dto/CourseLessonVideoRandDTO"));
const BaseAuthorization_1 = __importStar(require("./common/class/BaseAuthorization"));
const user_authorization_1 = __importDefault(require("./modules/user/authorization/user.authorization"));
const class_type_1 = require("./modules/class/class.type");
const class_repository_1 = __importDefault(require("./modules/class/repository/class.repository"));
const class_service_1 = __importDefault(require("./modules/class/service/class.service"));
const class_controller_1 = __importDefault(require("./modules/class/controller/class.controller"));
const class_authorization_1 = __importDefault(require("./modules/class/authorization/class.authorization"));
const assignment_type_1 = require("./modules/assignment/assignment.type");
const assignment_repository_1 = __importDefault(require("./modules/assignment/repository/assignment.repository"));
const assignment_service_1 = __importDefault(require("./modules/assignment/service/assignment.service"));
const assignment_controller_1 = __importDefault(require("./modules/assignment/controller/assignment.controller"));
const assignment_authorization_1 = __importDefault(require("./modules/assignment/authorization/assignment.authorization"));
const event_type_1 = require("./modules/event/event.type");
const event_repository_1 = __importDefault(require("./modules/event/repository/event.repository"));
const event_service_1 = __importDefault(require("./modules/event/service/event.service"));
const event_controller_1 = __importDefault(require("./modules/event/controller/event.controller"));
const event_authorization_1 = __importDefault(require("./modules/event/authorization/event.authorization"));
const dIContainer = new inversify_1.Container();
/**
 * Repository
 *
 */
dIContainer.bind(repository_type_1.RepositoryDITypes.FACADE).to(Repository_1.default);
/**
 * RandDTO
 *
 */
dIContainer.bind(rand_dto_type_1.RandDTODITypes.FACADE).to(RandDTO_1.default);
dIContainer.bind(rand_dto_type_1.RandDTODITypes.USER).to(UserRandDTO_1.default);
dIContainer.bind(rand_dto_type_1.RandDTODITypes.COURSE).to(CourseRandDTO_1.default);
dIContainer
    .bind(rand_dto_type_1.RandDTODITypes.COURSE_LESSON)
    .to(CourseLessonRandDTO_1.default);
dIContainer
    .bind(rand_dto_type_1.RandDTODITypes.COURSE_LESSON_VIDEO)
    .to(CourseLessonVideoRandDTO_1.default);
/**
 * PrismaRandDB
 *
 */
dIContainer.bind(rand_type_1.PrismaRandDBDITypes.FACADE).to(RandPrisma_1.default);
dIContainer.bind(rand_type_1.PrismaRandDBDITypes.USER).to(PrismaUserRandDB_1.default);
dIContainer
    .bind(rand_type_1.PrismaRandDBDITypes.COURSE)
    .to(PrismaCourseRandDB_1.default);
dIContainer
    .bind(rand_type_1.PrismaRandDBDITypes.COURSE_CATEGORY)
    .to(PrismaCourseCategoryRandDB_1.default);
dIContainer
    .bind(rand_type_1.PrismaRandDBDITypes.COURSE_ENROLLMENT)
    .to(PrismaCourseEnrollmentRandDB_1.default);
dIContainer
    .bind(rand_type_1.PrismaRandDBDITypes.COURSE_LESSON)
    .to(PrismaCourseLessonRandDB_1.default);
dIContainer
    .bind(rand_type_1.PrismaRandDBDITypes.COURSE_LESSON_VIDEO)
    .to(PrismaCourseLessonVideoRandDB_1.default);
/**
 * PrismaQueryRaw
 *
 */
dIContainer
    .bind(prisma_query_raw_type_1.PrismaQueryRawDITypes.PRISMA_QUERY_RAW)
    .to(PrismaQueryRaw_1.default);
dIContainer
    .bind(prisma_query_raw_type_1.PrismaQueryRawDITypes.USER)
    .to(UserPrismaQueryRaw_1.default);
dIContainer
    .bind(prisma_query_raw_type_1.PrismaQueryRawDITypes.COURSE)
    .to(CoursePrismaQueryRaw_1.default);
dIContainer
    .bind(prisma_query_raw_type_1.PrismaQueryRawDITypes.COURSE_CATEGORY)
    .to(CourseCategoryPrismaQueryRaw_1.default);
dIContainer
    .bind(prisma_query_raw_type_1.PrismaQueryRawDITypes.COURSE_ENROLLMENT)
    .to(CourseEnrollmentPrismaQueryRaw_1.default);
dIContainer
    .bind(prisma_query_raw_type_1.PrismaQueryRawDITypes.COURSE_LESSON)
    .to(CourseLessonPrismaQueryRaw_1.default);
dIContainer
    .bind(prisma_query_raw_type_1.PrismaQueryRawDITypes.COURSE_LESSON_VIDEO)
    .to(CourseLessonVideoPrismaQueryRaw_1.default);
/**
 * PrismaPromise
 *
 */
dIContainer
    .bind(prisma_promise_type_1.PrismaPromiseDITypes.PRISMA_PROMISE)
    .to(PrismaPromise_1.default);
dIContainer
    .bind(prisma_promise_type_1.PrismaPromiseDITypes.COURSE)
    .to(CoursePrismaPromise_1.default);
/**
 * PrismaTable Container
 *
 */
dIContainer.bind(PrismaTable_1.PrismaTableDITypes.TABLE).to(PrismaTable_1.default);
dIContainer.bind(PrismaTable_1.PrismaTableDITypes.COURSE).to(PrismaCourseTable_1.default);
dIContainer
    .bind(PrismaTable_1.PrismaTableDITypes.COURSE_ENROLLMENT)
    .to(PrismaCourseEnrollmentTable_1.default);
dIContainer
    .bind(PrismaTable_1.PrismaTableDITypes.COURSE_LESSON)
    .to(PrismaCourseLessonTable_1.default);
dIContainer
    .bind(PrismaTable_1.PrismaTableDITypes.COURSE_LESSON_VIDEO)
    .to(PrismaCourseLessonVideoTable_1.default);
dIContainer
    .bind(PrismaTable_1.PrismaTableDITypes.COURSE_LIKE)
    .to(PrismaCourseLikeTable_1.default);
/**
 * User Container
 *
 */
dIContainer.bind(user_type_1.UserDITypes.REPOSITORY).to(user_repository_1.UserRepository);
dIContainer.bind(user_type_1.UserDITypes.SERVICE).to(user_service_1.UserService);
dIContainer.bind(user_type_1.UserDITypes.CONTROLLER).to(user_controller_1.UserController);
dIContainer
    .bind(user_type_1.UserDITypes.AUTHORIZATION)
    .to(user_authorization_1.default);
/**
 * Course Container
 *
 */
dIContainer
    .bind(course_type_1.CourseDITypes.REPOSITORY)
    .to(course_repository_1.CourseRepository);
dIContainer.bind(course_type_1.CourseDITypes.SERVICE).to(course_service_1.CourseService);
dIContainer
    .bind(course_type_1.CourseDITypes.CONTROLLER)
    .to(course_controller_1.CourseController);
dIContainer
    .bind(course_type_1.CourseDITypes.AUTHORIZATION)
    .to(course_authorization_1.CourseAuthorization);
/**
 * Course Category
 *
 */
dIContainer
    .bind(category_type_1.CourseCategoryDITypes.REPOSITORY)
    .to(category_repository_1.CourseCategoryRepository);
dIContainer
    .bind(category_type_1.CourseCategoryDITypes.SERVICE)
    .to(category_service_1.CourseCategoryService);
dIContainer
    .bind(category_type_1.CourseCategoryDITypes.CONTROLLER)
    .to(category_controller_1.CourseCategoryController);
dIContainer
    .bind(category_type_1.CourseCategoryDITypes.AUTHORIZATION)
    .to(category_authorization_1.default);
/**
 * Course Enrollment
 *
 */
dIContainer
    .bind(enrollment_type_1.CourseEnrollmentDITypes.REPOSITORY)
    .to(enrollment_repository_1.default);
dIContainer
    .bind(enrollment_type_1.CourseEnrollmentDITypes.SERVICE)
    .to(enrollment_service_1.CourseEnrollmentService);
dIContainer
    .bind(enrollment_type_1.CourseEnrollmentDITypes.CONTROLLER)
    .to(enrollment_controller_1.CourseEnrollmentController);
dIContainer
    .bind(enrollment_type_1.CourseEnrollmentDITypes.AUTHORIZATION)
    .to(enrollment_authorization_1.default);
/**
 * Course Lesson
 *
 */
dIContainer
    .bind(lesson_type_1.CourseLessonDITypes.REPOSITORY)
    .to(lesson_repository_1.CourseLessonRepository);
dIContainer
    .bind(lesson_type_1.CourseLessonDITypes.SERVICE)
    .to(lesson_service_1.CourseLessonService);
dIContainer
    .bind(lesson_type_1.CourseLessonDITypes.CONTROLLER)
    .to(lesson_controller_1.CourseLessonController);
dIContainer
    .bind(lesson_type_1.CourseLessonDITypes.AUTHORIZATION)
    .to(lesson_authorization_1.default);
/**
 * Course Lesson Video
 *
 */
dIContainer
    .bind(video_type_1.CourseLessonVideoDITypes.REPOSITORY)
    .to(video_repository_1.CourseLessonVideoRepository);
dIContainer
    .bind(video_type_1.CourseLessonVideoDITypes.SERVICE)
    .to(video_service_1.CourseLessonVideoService);
dIContainer
    .bind(video_type_1.CourseLessonVideoDITypes.CONTROLLER)
    .to(video_controller_1.CourseLessonVideoController);
dIContainer
    .bind(video_type_1.CourseLessonVideoDITypes.AUTHORIZATION)
    .to(video_authorization_1.default);
/**
 * Course Class
 *
 */
dIContainer
    .bind(class_type_1.CourseClassDITypes.REPOSITORY)
    .to(class_repository_1.default);
dIContainer
    .bind(class_type_1.CourseClassDITypes.SERVICE)
    .to(class_service_1.default);
dIContainer
    .bind(class_type_1.CourseClassDITypes.CONTROLLER)
    .to(class_controller_1.default);
dIContainer
    .bind(class_type_1.CourseClassDITypes.AUTHORIZATION)
    .to(class_authorization_1.default);
/**
 * Course Class Assignment
 *
 */
dIContainer
    .bind(assignment_type_1.CourseClassAssignmentDITypes.REPOSITORY)
    .to(assignment_repository_1.default);
dIContainer
    .bind(assignment_type_1.CourseClassAssignmentDITypes.SERVICE)
    .to(assignment_service_1.default);
dIContainer
    .bind(assignment_type_1.CourseClassAssignmentDITypes.CONTROLLER)
    .to(assignment_controller_1.default);
dIContainer
    .bind(assignment_type_1.CourseClassAssignmentDITypes.AUTHORIZATION)
    .to(assignment_authorization_1.default);
/**
 * Event
 *
 */
dIContainer.bind(event_type_1.EventDITypes.REPOSITORY).to(event_repository_1.default);
dIContainer.bind(event_type_1.EventDITypes.SERVICE).to(event_service_1.default);
dIContainer.bind(event_type_1.EventDITypes.CONTROLLER).to(event_controller_1.default);
dIContainer
    .bind(event_type_1.EventDITypes.AUTHORIZATION)
    .to(event_authorization_1.default);
/**
 * Common
 *
 */
dIContainer
    .bind(BaseAuthorization_1.BaseAuthorizationDITypes)
    .to(BaseAuthorization_1.default);
exports.default = dIContainer;
