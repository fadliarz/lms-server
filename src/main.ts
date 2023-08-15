import "dotenv/config";
import App from "./app";
import validateEnv from "./common/validations/validateEnv";
import { Api } from "./common/types";
import UserRouter from "./modules/user/router/user.router";
import { getAuthMiddleWare } from "./middlewares/getAuthMiddleware";
import { userUrls } from "./modules/user/user.type";
import CourseRouter from "./modules/course/router/course.router";
import { courseUrls } from "./modules/course/course.type";
import CourseEnrollmentRouter from "./modules/enrollment/router/enrollment.router";
import { courseEnrollmentUrls } from "./modules/enrollment/enrollment.type";
import CourseLessonRouter from "./modules/lesson/router/lesson.router";
import { courseLessonUrls } from "./modules/lesson/lesson.type";

/**
 * Validate environtment variables.
 */
validateEnv();

/**
 * Configuration
 */
const userApi = {
  router: UserRouter(getAuthMiddleWare()),
  path: userUrls.root,
};
const courseApi = {
  router: CourseRouter(getAuthMiddleWare()),
  path: courseUrls.root,
};
const courseEnrollmentApi = {
  router: CourseEnrollmentRouter(getAuthMiddleWare()),
  path: courseEnrollmentUrls.root
};
const courseLessonApi = {
  router: CourseLessonRouter(getAuthMiddleWare()),
  path: courseLessonUrls.root
}

const routers: Api[] = [userApi, courseApi, courseEnrollmentApi, courseLessonApi];
const port = Number(process.env.PORT) || 5000;

/**
 * Make instance of application
 */
const app = new App(routers, port);

/**
 * Listen to application
 */
app.listen();
