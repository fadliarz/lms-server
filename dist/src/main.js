"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const validateEnv_1 = __importDefault(require("./common/functions/validateEnv"));
const user_router_1 = __importDefault(require("./modules/user/router/user.router"));
const getAuthMiddleware_1 = require("./middlewares/getAuthMiddleware");
const user_type_1 = require("./modules/user/user.type");
const course_router_1 = __importDefault(require("./modules/course/router/course.router"));
const course_type_1 = require("./modules/course/course.type");
const enrollment_router_1 = __importDefault(require("./modules/enrollment/router/enrollment.router"));
const enrollment_type_1 = require("./modules/enrollment/enrollment.type");
const lesson_router_1 = __importDefault(require("./modules/lesson/router/lesson.router"));
const lesson_type_1 = require("./modules/lesson/lesson.type");
const video_router_1 = __importDefault(require("./modules/video/router/video.router"));
const video_type_1 = require("./modules/video/video.type");
const category_router_1 = __importDefault(require("./modules/category/router/category.router"));
const category_type_1 = require("./modules/category/category.type");
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
    path: user_type_1.userUrls.root,
};
const courseApi = {
    router: (0, course_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: course_type_1.courseUrls.root,
};
const courseCategoryApi = {
    router: (0, category_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: category_type_1.courseCategoryUrls.root,
};
const courseEnrollmentApi = {
    router: (0, enrollment_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: enrollment_type_1.courseEnrollmentUrls.root,
};
const courseLessonApi = {
    router: (0, lesson_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: lesson_type_1.courseLessonUrls.root,
};
const courseLessonVideoApi = {
    router: (0, video_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: video_type_1.courseLessonVideoUrls.root,
};
const routers = [
    userApi,
    courseApi,
    courseCategoryApi,
    courseEnrollmentApi,
    courseLessonApi,
    courseLessonVideoApi,
];
const port = Number(process.env.PORT) || 5000;
/**
 * Make instance of application
 *
 */
const app = new app_1.default(routers, port);
app.express.listen(5555, () => {
    console.log("Server is running on the port 5555");
});
