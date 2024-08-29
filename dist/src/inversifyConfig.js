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
const user_type_1 = require("./modules/user/user.type");
const course_type_1 = require("./modules/course/course.type");
const enrollment_type_1 = require("./modules/enrollment/enrollment.type");
const enrollment_repository_1 = __importDefault(require("./modules/enrollment/repository/enrollment.repository"));
const lesson_type_1 = require("./modules/lesson/lesson.type");
const video_type_1 = require("./modules/video/video.type");
const category_repository_1 = __importDefault(require("./modules/category/repository/category.repository"));
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
const repository_type_1 = require("./common/class/repository/repository.type");
const Repository_1 = __importDefault(require("./common/class/repository/Repository"));
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
const category_service_1 = __importDefault(require("./modules/category/service/category.service"));
const category_controller_1 = __importDefault(require("./modules/category/controller/category.controller"));
const course_repository_1 = __importDefault(require("./modules/course/repository/course.repository"));
const course_service_1 = __importDefault(require("./modules/course/service/course.service"));
const course_controller_1 = __importDefault(require("./modules/course/controller/course.controller"));
const course_authorization_1 = __importDefault(require("./modules/course/authorization/course.authorization"));
const enrollment_service_1 = __importDefault(require("./modules/enrollment/service/enrollment.service"));
const enrollment_controller_1 = __importDefault(require("./modules/enrollment/controller/enrollment.controller"));
const lesson_repository_1 = __importDefault(require("./modules/lesson/repository/lesson.repository"));
const lesson_service_1 = __importDefault(require("./modules/lesson/service/lesson.service"));
const lesson_controller_1 = __importDefault(require("./modules/lesson/controller/lesson.controller"));
const user_repository_1 = __importDefault(require("./modules/user/repository/user.repository"));
const user_service_1 = __importDefault(require("./modules/user/service/user.service"));
const user_controller_1 = __importDefault(require("./modules/user/controller/user.controller"));
const video_repository_1 = __importDefault(require("./modules/video/repository/video.repository"));
const video_service_1 = __importDefault(require("./modules/video/service/video.service"));
const video_controller_1 = __importDefault(require("./modules/video/controller/video.controller"));
const assignment_type_2 = require("./modules/personal-assignment/assignment.type");
const assignment_repository_2 = __importDefault(require("./modules/personal-assignment/repository/assignment.repository"));
const assignment_service_2 = __importDefault(require("./modules/personal-assignment/service/assignment.service"));
const assignment_controller_2 = __importDefault(require("./modules/personal-assignment/controller/assignment.controller"));
const assignment_authorization_2 = __importDefault(require("./modules/personal-assignment/authorization/assignment.authorization"));
const competition_repository_1 = __importDefault(require("./modules/competition/repository/competition.repository"));
const competition_service_1 = __importDefault(require("./modules/competition/service/competition.service"));
const competition_controller_1 = __importDefault(require("./modules/competition/controller/competition.controller"));
const competition_type_1 = require("./modules/competition/competition.type");
const competition_authorization_1 = __importDefault(require("./modules/competition/authorization/competition.authorization"));
const schedule_repository_1 = __importDefault(require("./modules/schedule/repository/schedule.repository"));
const schedule_service_1 = __importDefault(require("./modules/schedule/service/schedule.service"));
const schedule_authorization_1 = __importDefault(require("./modules/schedule/authorization/schedule.authorization"));
const schedule_type_1 = require("./modules/schedule/schedule.type");
const department_repository_1 = __importDefault(require("./modules/department/repository/department.repository"));
const department_service_1 = __importDefault(require("./modules/department/service/department.service"));
const department_controller_1 = __importDefault(require("./modules/department/controller/department.controller"));
const department_authorization_1 = __importDefault(require("./modules/department/authorization/department.authorization"));
const department_type_1 = require("./modules/department/department.type");
const division_type_1 = require("./modules/division/division.type");
const division_repository_1 = __importDefault(require("./modules/division/repository/division.repository"));
const division_service_1 = __importDefault(require("./modules/division/service/division.service"));
const division_controller_1 = __importDefault(require("./modules/division/controller/division.controller"));
const division_authorization_1 = __importDefault(require("./modules/division/authorization/division.authorization"));
const enrollment_type_2 = require("./modules/division-enrollment/enrollment.type");
const enrollment_repository_2 = __importDefault(require("./modules/division-enrollment/repository/enrollment.repository"));
const enrollment_service_2 = __importDefault(require("./modules/division-enrollment/service/enrollment.service"));
const enrollment_controller_2 = __importDefault(require("./modules/division-enrollment/controller/enrollment.controller"));
const enrollment_authorization_2 = __importDefault(require("./modules/division-enrollment/authorization/enrollment.authorization"));
const enrollment_repository_3 = __importDefault(require("./modules/program-enrollment/repository/enrollment.repository"));
const enrollment_service_3 = __importDefault(require("./modules/program-enrollment/service/enrollment.service"));
const enrollment_controller_3 = __importDefault(require("./modules/program-enrollment/controller/enrollment.controller"));
const enrollment_authorization_3 = __importDefault(require("./modules/program-enrollment/authorization/enrollment.authorization"));
const enrollment_type_3 = require("./modules/program-enrollment/enrollment.type");
const report_type_1 = require("./modules/report/report.type");
const report_repository_1 = __importDefault(require("./modules/report/repository/report.repository"));
const report_service_1 = __importDefault(require("./modules/report/service/report.service"));
const report_controller_1 = __importDefault(require("./modules/report/controller/report.controller"));
const report_authorization_1 = __importDefault(require("./modules/report/authorization/report.authorization"));
const scholarship_repository_1 = __importDefault(require("./modules/scholarship/repository/scholarship.repository"));
const scholarship_service_1 = __importDefault(require("./modules/scholarship/service/scholarship.service"));
const scholarship_controller_1 = __importDefault(require("./modules/scholarship/controller/scholarship.controller"));
const scholarship_authorization_1 = __importDefault(require("./modules/scholarship/authorization/scholarship.authorization"));
const scholarship_type_1 = require("./modules/scholarship/scholarship.type");
const schedule_controller_1 = __importDefault(require("./modules/schedule/controller/schedule.controller"));
const DepartmentPrismaQueryRaw_1 = __importDefault(require("./common/class/prisma_query_raw/DepartmentPrismaQueryRaw"));
const completion_type_1 = require("./modules/assignment-completion/completion.type");
const completion_repository_1 = __importDefault(require("./modules/assignment-completion/repository/completion.repository"));
const completion_service_1 = __importDefault(require("./modules/assignment-completion/service/completion.service"));
const completion_authorization_1 = __importDefault(require("./modules/assignment-completion/authorization/completion.authorization"));
const completion_controller_1 = __importDefault(require("./modules/assignment-completion/controller/completion.controller"));
const program_type_1 = require("./modules/program/program.type");
const program_repository_1 = __importDefault(require("./modules/program/repository/program.repository"));
const program_service_1 = __importDefault(require("./modules/program/service/program.service"));
const program_controller_1 = __importDefault(require("./modules/program/controller/program.controller"));
const program_authorization_1 = __importDefault(require("./modules/program/authorization/program.authorization"));
const product_type_1 = require("./modules/product/product.type");
const product_repository_1 = __importDefault(require("./modules/product/repository/product.repository"));
const product_service_1 = __importDefault(require("./modules/product/service/product.service"));
const product_controller_1 = __importDefault(require("./modules/product/controller/product.controller"));
const product_authorization_1 = __importDefault(require("./modules/product/authorization/product.authorization"));
const variant_repository_1 = __importDefault(require("./modules/product-variant/repository/variant.repository"));
const variant_type_1 = require("./modules/product-variant/variant.type");
const variant_service_1 = __importDefault(require("./modules/product-variant/service/variant.service"));
const variant_controller_1 = __importDefault(require("./modules/product-variant/controller/variant.controller"));
const variant_authorization_1 = __importDefault(require("./modules/product-variant/authorization/variant.authorization"));
const order_type_1 = require("./modules/order/order.type");
const order_repository_1 = __importDefault(require("./modules/order/repository/order.repository"));
const order_service_1 = __importDefault(require("./modules/order/service/order.service"));
const order_controller_1 = __importDefault(require("./modules/order/controller/order.controller"));
const order_authorization_1 = __importDefault(require("./modules/order/authorization/order.authorization"));
const dIContainer = new inversify_1.Container();
/**
 * Repository
 *
 */
dIContainer.bind(repository_type_1.RepositoryDITypes.FACADE).to(Repository_1.default);
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
dIContainer
    .bind(prisma_query_raw_type_1.PrismaQueryRawDITypes.DEPARTMENT)
    .to(DepartmentPrismaQueryRaw_1.default);
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
dIContainer.bind(user_type_1.UserDITypes.REPOSITORY).to(user_repository_1.default);
dIContainer.bind(user_type_1.UserDITypes.SERVICE).to(user_service_1.default);
dIContainer.bind(user_type_1.UserDITypes.CONTROLLER).to(user_controller_1.default);
dIContainer
    .bind(user_type_1.UserDITypes.AUTHORIZATION)
    .to(user_authorization_1.default);
/**
 * PersonalAssignment Container
 *
 */
dIContainer
    .bind(assignment_type_2.PersonalAssignmentDITypes.REPOSITORY)
    .to(assignment_repository_2.default);
dIContainer
    .bind(assignment_type_2.PersonalAssignmentDITypes.SERVICE)
    .to(assignment_service_2.default);
dIContainer
    .bind(assignment_type_2.PersonalAssignmentDITypes.CONTROLLER)
    .to(assignment_controller_2.default);
dIContainer
    .bind(assignment_type_2.PersonalAssignmentDITypes.AUTHORIZATION)
    .to(assignment_authorization_2.default);
/**
 * Course Container
 *
 */
dIContainer
    .bind(course_type_1.CourseDITypes.REPOSITORY)
    .to(course_repository_1.default);
dIContainer.bind(course_type_1.CourseDITypes.SERVICE).to(course_service_1.default);
dIContainer
    .bind(course_type_1.CourseDITypes.CONTROLLER)
    .to(course_controller_1.default);
dIContainer
    .bind(course_type_1.CourseDITypes.AUTHORIZATION)
    .to(course_authorization_1.default);
/**
 * Course Category
 *
 */
dIContainer
    .bind(category_type_1.CourseCategoryDITypes.REPOSITORY)
    .to(category_repository_1.default);
dIContainer
    .bind(category_type_1.CourseCategoryDITypes.SERVICE)
    .to(category_service_1.default);
dIContainer
    .bind(category_type_1.CourseCategoryDITypes.CONTROLLER)
    .to(category_controller_1.default);
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
    .to(enrollment_service_1.default);
dIContainer
    .bind(enrollment_type_1.CourseEnrollmentDITypes.CONTROLLER)
    .to(enrollment_controller_1.default);
dIContainer
    .bind(enrollment_type_1.CourseEnrollmentDITypes.AUTHORIZATION)
    .to(enrollment_authorization_1.default);
/**
 * Course Lesson
 *
 */
dIContainer
    .bind(lesson_type_1.CourseLessonDITypes.REPOSITORY)
    .to(lesson_repository_1.default);
dIContainer
    .bind(lesson_type_1.CourseLessonDITypes.SERVICE)
    .to(lesson_service_1.default);
dIContainer
    .bind(lesson_type_1.CourseLessonDITypes.CONTROLLER)
    .to(lesson_controller_1.default);
dIContainer
    .bind(lesson_type_1.CourseLessonDITypes.AUTHORIZATION)
    .to(lesson_authorization_1.default);
/**
 * Course Lesson Video
 *
 */
dIContainer
    .bind(video_type_1.CourseLessonVideoDITypes.REPOSITORY)
    .to(video_repository_1.default);
dIContainer
    .bind(video_type_1.CourseLessonVideoDITypes.SERVICE)
    .to(video_service_1.default);
dIContainer
    .bind(video_type_1.CourseLessonVideoDITypes.CONTROLLER)
    .to(video_controller_1.default);
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
 * Course Class Assignment Completion
 *
 */
dIContainer
    .bind(completion_type_1.CourseClassAssignmentCompletionDITypes.REPOSITORY)
    .to(completion_repository_1.default);
dIContainer
    .bind(completion_type_1.CourseClassAssignmentCompletionDITypes.SERVICE)
    .to(completion_service_1.default);
dIContainer
    .bind(completion_type_1.CourseClassAssignmentCompletionDITypes.CONTROLLER)
    .to(completion_controller_1.default);
dIContainer
    .bind(completion_type_1.CourseClassAssignmentCompletionDITypes.AUTHORIZATION)
    .to(completion_authorization_1.default);
/**
 * Course Schedule
 *
 */
dIContainer
    .bind(schedule_type_1.CourseScheduleDITypes.REPOSITORY)
    .to(schedule_repository_1.default);
dIContainer
    .bind(schedule_type_1.CourseScheduleDITypes.SERVICE)
    .to(schedule_service_1.default);
dIContainer
    .bind(schedule_type_1.CourseScheduleDITypes.CONTROLLER)
    .to(schedule_controller_1.default);
dIContainer
    .bind(schedule_type_1.CourseScheduleDITypes.AUTHORIZATION)
    .to(schedule_authorization_1.default);
/**
 * Department
 *
 */
dIContainer
    .bind(department_type_1.DepartmentDITypes.REPOSITORY)
    .to(department_repository_1.default);
dIContainer
    .bind(department_type_1.DepartmentDITypes.SERVICE)
    .to(department_service_1.default);
dIContainer
    .bind(department_type_1.DepartmentDITypes.CONTROLLER)
    .to(department_controller_1.default);
dIContainer
    .bind(department_type_1.DepartmentDITypes.AUTHORIZATION)
    .to(department_authorization_1.default);
/**
 * Department Division
 *
 */
dIContainer
    .bind(division_type_1.DepartmentDivisionDITypes.REPOSITORY)
    .to(division_repository_1.default);
dIContainer
    .bind(division_type_1.DepartmentDivisionDITypes.SERVICE)
    .to(division_service_1.default);
dIContainer
    .bind(division_type_1.DepartmentDivisionDITypes.CONTROLLER)
    .to(division_controller_1.default);
dIContainer
    .bind(division_type_1.DepartmentDivisionDITypes.AUTHORIZATION)
    .to(division_authorization_1.default);
/**
 * Department Division Enrollment
 *
 */
dIContainer
    .bind(enrollment_type_2.DepartmentDivisionEnrollmentDITypes.REPOSITORY)
    .to(enrollment_repository_2.default);
dIContainer
    .bind(enrollment_type_2.DepartmentDivisionEnrollmentDITypes.SERVICE)
    .to(enrollment_service_2.default);
dIContainer
    .bind(enrollment_type_2.DepartmentDivisionEnrollmentDITypes.CONTROLLER)
    .to(enrollment_controller_2.default);
dIContainer
    .bind(enrollment_type_2.DepartmentDivisionEnrollmentDITypes.AUTHORIZATION)
    .to(enrollment_authorization_2.default);
/**
 * Department Division Program
 *
 */
dIContainer
    .bind(program_type_1.DepartmentProgramDITypes.REPOSITORY)
    .to(program_repository_1.default);
dIContainer
    .bind(program_type_1.DepartmentProgramDITypes.SERVICE)
    .to(program_service_1.default);
dIContainer
    .bind(program_type_1.DepartmentProgramDITypes.CONTROLLER)
    .to(program_controller_1.default);
dIContainer
    .bind(program_type_1.DepartmentProgramDITypes.AUTHORIZATION)
    .to(program_authorization_1.default);
/**
 * Department Division Program Enrollment
 *
 */
dIContainer
    .bind(enrollment_type_3.DepartmentProgramEnrollmentDITypes.REPOSITORY)
    .to(enrollment_repository_3.default);
dIContainer
    .bind(enrollment_type_3.DepartmentProgramEnrollmentDITypes.SERVICE)
    .to(enrollment_service_3.default);
dIContainer
    .bind(enrollment_type_3.DepartmentProgramEnrollmentDITypes.CONTROLLER)
    .to(enrollment_controller_3.default);
dIContainer
    .bind(enrollment_type_3.DepartmentProgramEnrollmentDITypes.AUTHORIZATION)
    .to(enrollment_authorization_3.default);
/**
 * Report
 *
 */
dIContainer
    .bind(report_type_1.ReportDITypes.REPOSITORY)
    .to(report_repository_1.default);
dIContainer.bind(report_type_1.ReportDITypes.SERVICE).to(report_service_1.default);
dIContainer
    .bind(report_type_1.ReportDITypes.CONTROLLER)
    .to(report_controller_1.default);
dIContainer
    .bind(report_type_1.ReportDITypes.AUTHORIZATION)
    .to(report_authorization_1.default);
/**
 * Scholarship
 *
 */
dIContainer
    .bind(scholarship_type_1.ScholarshipDITypes.REPOSITORY)
    .to(scholarship_repository_1.default);
dIContainer
    .bind(scholarship_type_1.ScholarshipDITypes.SERVICE)
    .to(scholarship_service_1.default);
dIContainer
    .bind(scholarship_type_1.ScholarshipDITypes.CONTROLLER)
    .to(scholarship_controller_1.default);
dIContainer
    .bind(scholarship_type_1.ScholarshipDITypes.AUTHORIZATION)
    .to(scholarship_authorization_1.default);
/**
 * Competition
 *
 */
dIContainer
    .bind(competition_type_1.CompetitionDITypes.REPOSITORY)
    .to(competition_repository_1.default);
dIContainer
    .bind(competition_type_1.CompetitionDITypes.SERVICE)
    .to(competition_service_1.default);
dIContainer
    .bind(competition_type_1.CompetitionDITypes.CONTROLLER)
    .to(competition_controller_1.default);
dIContainer
    .bind(competition_type_1.CompetitionDITypes.AUTHORIZATION)
    .to(competition_authorization_1.default);
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
 * Product
 *
 */
dIContainer
    .bind(product_type_1.ProductDITypes.REPOSITORY)
    .to(product_repository_1.default);
dIContainer.bind(product_type_1.ProductDITypes.SERVICE).to(product_service_1.default);
dIContainer
    .bind(product_type_1.ProductDITypes.CONTROLLER)
    .to(product_controller_1.default);
dIContainer
    .bind(product_type_1.ProductDITypes.AUTHORIZATION)
    .to(product_authorization_1.default);
/**
 * Product Variant
 *
 */
dIContainer
    .bind(variant_type_1.ProductVariantDITypes.REPOSITORY)
    .to(variant_repository_1.default);
dIContainer
    .bind(variant_type_1.ProductVariantDITypes.SERVICE)
    .to(variant_service_1.default);
dIContainer
    .bind(variant_type_1.ProductVariantDITypes.CONTROLLER)
    .to(variant_controller_1.default);
dIContainer
    .bind(variant_type_1.ProductVariantDITypes.AUTHORIZATION)
    .to(variant_authorization_1.default);
/**
 * Order
 *
 */
dIContainer.bind(order_type_1.OrderDITypes.REPOSITORY).to(order_repository_1.default);
dIContainer.bind(order_type_1.OrderDITypes.SERVICE).to(order_service_1.default);
dIContainer.bind(order_type_1.OrderDITypes.CONTROLLER).to(order_controller_1.default);
dIContainer
    .bind(order_type_1.OrderDITypes.AUTHORIZATION)
    .to(order_authorization_1.default);
/**
 * Common
 *
 */
dIContainer
    .bind(BaseAuthorization_1.BaseAuthorizationDITypes)
    .to(BaseAuthorization_1.default);
exports.default = dIContainer;
