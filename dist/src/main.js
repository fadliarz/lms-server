"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const validateEnv_1 = __importDefault(require("./common/functions/validateEnv"));
const user_router_1 = __importDefault(require("./modules/user/router/user.router"));
const getAuthMiddleware_1 = require("./middlewares/getAuthMiddleware");
const course_router_1 = __importDefault(require("./modules/course/router/course.router"));
const enrollment_router_1 = __importDefault(require("./modules/enrollment/router/enrollment.router"));
const lesson_router_1 = __importDefault(require("./modules/lesson/router/lesson.router"));
const video_router_1 = __importDefault(require("./modules/video/router/video.router"));
const category_router_1 = __importDefault(require("./modules/category/router/category.router"));
const PrismaClientSingleton_1 = __importDefault(require("./common/class/PrismaClientSingleton"));
const class_router_1 = __importDefault(require("./modules/class/router/class.router"));
const assignment_router_1 = __importDefault(require("./modules/assignment/router/assignment.router"));
const competition_router_1 = __importDefault(require("./modules/competition/router/competition.router"));
const scholarship_router_1 = __importDefault(require("./modules/scholarship/router/scholarship.router"));
const schedule_router_1 = __importDefault(require("./modules/schedule/router/schedule.router"));
const department_router_1 = __importDefault(require("./modules/department/router/department.router"));
const division_router_1 = __importDefault(require("./modules/division/router/division.router"));
const enrollment_router_2 = __importDefault(require("./modules/division-enrollment/router/enrollment.router"));
const program_router_1 = __importDefault(require("./modules/program/router/program.router"));
const assignment_router_2 = __importDefault(require("./modules/personal-assignment/router/assignment.router"));
const enrollment_router_3 = __importDefault(require("./modules/program-enrollment/router/enrollment.router"));
const event_router_1 = __importDefault(require("./modules/event/router/event.router"));
const report_router_1 = __importDefault(require("./modules/report/router/report.router"));
const completion_router_1 = __importDefault(require("./modules/assignment-completion/router/completion.router"));
const product_router_1 = __importDefault(require("./modules/product/router/product.router"));
const variant_router_1 = __importDefault(require("./modules/product-variant/router/variant.router"));
const order_router_1 = __importDefault(require("./modules/order/router/order.router"));
const attachment_router_1 = __importDefault(require("./modules/attachment/router/attachment.router"));
/**
 * Validate environment variables
 *
 */
(0, validateEnv_1.default)();
/**
 * Configuration
 *
 */
const userApi = {
    router: (0, user_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const personalAssignmentApi = {
    router: (0, assignment_router_2.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const reportApi = {
    router: (0, report_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const courseApi = {
    router: (0, course_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const courseScheduleApi = {
    router: (0, schedule_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const courseCategoryApi = {
    router: (0, category_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const courseLessonApi = {
    router: (0, lesson_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const courseEnrollmentApi = {
    router: (0, enrollment_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const courseLessonVideoApi = {
    router: (0, video_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const courseLessonAttachmentApi = {
    router: (0, attachment_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const courseClassApi = {
    router: (0, class_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const courseClassAssignmentApi = {
    router: (0, assignment_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const courseClassAssignmentCompletionApi = {
    router: (0, completion_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const departmentApi = {
    router: (0, department_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const departmentDivisionApi = {
    router: (0, division_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const departmentDivisionEnrollmentApi = {
    router: (0, enrollment_router_2.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const departmentDivisionProgram = {
    router: (0, program_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const departmentDivisionProgramEnrollment = {
    router: (0, enrollment_router_3.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const event = {
    router: (0, event_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const scholarshipApi = {
    router: (0, scholarship_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const competitionApi = {
    router: (0, competition_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const productApi = {
    router: (0, product_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const productVariantApi = {
    router: (0, variant_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const orderApi = {
    router: (0, order_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1",
};
const routers = [
    userApi,
    personalAssignmentApi,
    reportApi,
    courseApi,
    courseScheduleApi,
    courseCategoryApi,
    courseEnrollmentApi,
    courseLessonApi,
    courseLessonVideoApi,
    courseLessonAttachmentApi,
    courseClassApi,
    courseClassAssignmentApi,
    courseClassAssignmentCompletionApi,
    departmentApi,
    departmentDivisionApi,
    departmentDivisionEnrollmentApi,
    departmentDivisionProgram,
    departmentDivisionProgramEnrollment,
    event,
    scholarshipApi,
    competitionApi,
    productApi,
    productVariantApi,
    orderApi,
];
const port = Number(process.env.PORT) || 5000;
/**
 * Make instance of application
 *
 */
const app = new app_1.default(routers, port);
/**
 * Make instance of prisma
 *
 */
const prisma = PrismaClientSingleton_1.default.getInstance();
prisma
    .$connect()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Successfully establishing database connection!");
    app.express.listen(port, () => {
        console.log(`Server is running on the port ${port}`);
    });
}))
    .catch((error) => {
    console.log("Failed establishing a database connection!");
    console.error("error: ", error);
});
