import "dotenv/config";
import App from "./app";
import validateEnv from "./common/validations/validateEnv";
import { Api } from "./common/types";
import UserRouter from "./modules/user/router/user.router";
import { getAuthMiddleWare } from "./middlewares/getAuthMiddleware";
import { userUrls } from "./modules/user/user.type";
import CourseRouter from "./modules/course/router/course.router";
import { courseUrls } from "./modules/course/course.type";
import { getAuthorizationMiddleware } from "./middlewares/getAuthorizationMiddleware";

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
  router: CourseRouter(getAuthorizationMiddleware()),
  path: courseUrls.root,
};

const routers: Api[] = [userApi, courseApi];
const port = Number(process.env.PORT) || 5000;

/**
 * Make instance of application
 */
const app = new App(routers, port);

/**
 * Listen to application
 */
app.listen();
