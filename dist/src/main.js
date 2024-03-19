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
const user_type_1 = require("./modules/user/user.type");
const course_router_1 = __importDefault(require("./modules/course/router/course.router"));
const course_type_1 = require("./modules/course/course.type");
const enrollment_router_1 = __importDefault(require("./modules/enrollment/router/enrollment.router"));
const lesson_router_1 = __importDefault(require("./modules/lesson/router/lesson.router"));
const video_router_1 = __importDefault(require("./modules/video/router/video.router"));
const category_router_1 = __importDefault(require("./modules/category/router/category.router"));
const category_type_1 = require("./modules/category/category.type");
const PrismaClientSingleton_1 = __importDefault(require("./common/class/PrismaClientSingleton"));
const seed_1 = __importDefault(require("../prisma/seed"));
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
    path: "/api/v1" + user_type_1.userUrls.root,
};
const courseApi = {
    router: (0, course_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1" + course_type_1.courseUrls.root,
};
const courseCategoryApi = {
    router: (0, category_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: "/api/v1" + category_type_1.courseCategoryUrls.root,
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
/**
 * Make instance of prisma
 *
 */
const prisma = PrismaClientSingleton_1.default.getInstance();
prisma
    .$connect()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Successfully establishing database connection!");
    if (process.env.NODE_ENV === "development") {
        yield (0, seed_1.default)();
    }
    app.express.listen(port, () => {
        console.log(`Server is running on the port ${port}`);
    });
}))
    .catch((error) => {
    console.log("Failed establishing a database connection!");
    console.error("error: ", error);
});
