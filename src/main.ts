import "dotenv/config";
import App from "./app";
import validateEnv from "./common/functions/validateEnv";
import UserRouter from "./modules/user/router/user.router";
import { getAuthMiddleWare } from "./middlewares/getAuthMiddleware";
import { userUrls } from "./modules/user/user.type";
import CourseRouter from "./modules/course/router/course.router";
import { courseUrls } from "./modules/course/course.type";
import CourseEnrollmentRouter from "./modules/enrollment/router/enrollment.router";
import CourseLessonRouter from "./modules/lesson/router/lesson.router";
import CourseLessonVideoRouter from "./modules/video/router/video.router";
import CourseCategoryRouter from "./modules/category/router/category.router";
import { courseCategoryUrls } from "./modules/category/category.type";
import PrismaClientSingleton from "./common/class/PrismaClientSingleton";
import { Api } from "./common/types";

/**
 * Validate environment variables
 *
 */
validateEnv();

/**
 * Configuration
 *
 */
const userApi = {
  router: UserRouter(getAuthMiddleWare()),
  path: "/api/v1" + userUrls.root,
};
const courseApi = {
  router: CourseRouter(getAuthMiddleWare()),
  path: "/api/v1" + courseUrls.root,
};
const courseCategoryApi = {
  router: CourseCategoryRouter(getAuthMiddleWare()),
  path: "/api/v1" + courseCategoryUrls.root,
};
const courseLessonApi = {
  router: CourseLessonRouter(getAuthMiddleWare()),
  path: "/api/v1",
};
const courseEnrollmentApi = {
  router: CourseEnrollmentRouter(getAuthMiddleWare()),
  path: "/api/v1",
};
const courseLessonVideoApi = {
  router: CourseLessonVideoRouter(getAuthMiddleWare()),
  path: "/api/v1",
};

const routers: Api[] = [
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
const app = new App(routers, port);

/**
 * Make instance of prisma
 *
 */
const prisma = PrismaClientSingleton.getInstance();

prisma
  .$connect()
  .then(async () => {
    console.log("Successfully establishing database connection!");

    app.express.listen(port, () => {
      console.log(`Server is running on the port ${port}`);
    });
  })
  .catch((error) => {
    console.log("Failed establishing a database connection!");

    console.error("error: ", error);
  });
