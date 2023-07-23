"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const validateEnv_1 = __importDefault(require("./common/validations/validateEnv"));
const user_router_1 = __importDefault(require("./modules/user/router/user.router"));
const getAuthMiddleware_1 = require("./middlewares/getAuthMiddleware");
const user_type_1 = require("./modules/user/user.type");
const course_router_1 = __importDefault(require("./modules/course/router/course.router"));
const course_type_1 = require("./modules/course/course.type");
const getAuthorizationMiddleware_1 = require("./middlewares/getAuthorizationMiddleware");
/**
 * Validate environtment variables.
 */
(0, validateEnv_1.default)();
/**
 * Configuration
 */
const userApi = {
    router: (0, user_router_1.default)((0, getAuthMiddleware_1.getAuthMiddleWare)()),
    path: user_type_1.userUrls.root,
};
const courseApi = {
    router: (0, course_router_1.default)((0, getAuthorizationMiddleware_1.getAuthorizationMiddleware)()),
    path: course_type_1.courseUrls.root,
};
const routers = [userApi, courseApi];
const port = Number(process.env.PORT) || 5000;
/**
 * Make instance of application
 */
const app = new app_1.default(routers, port);
/**
 * Listen to application
 */
app.listen();
