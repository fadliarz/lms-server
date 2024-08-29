import "dotenv/config";
import App from "./app";
import validateEnv from "./common/functions/validateEnv";
import UserRouter from "./modules/user/router/user.router";
import { getAuthMiddleWare } from "./middlewares/getAuthMiddleware";
import CourseRouter from "./modules/course/router/course.router";
import CourseEnrollmentRouter from "./modules/enrollment/router/enrollment.router";
import CourseLessonRouter from "./modules/lesson/router/lesson.router";
import CourseLessonVideoRouter from "./modules/video/router/video.router";
import CourseCategoryRouter from "./modules/category/router/category.router";
import PrismaClientSingleton from "./common/class/PrismaClientSingleton";
import { Api } from "./common/types";
import CourseClassRouter from "./modules/class/router/class.router";
import CourseClassAssignmentRouter from "./modules/assignment/router/assignment.router";
import CompetitionRouter from "./modules/competition/router/competition.router";
import ScholarshipRouter from "./modules/scholarship/router/scholarship.router";
import CourseScheduleRouter from "./modules/schedule/router/schedule.router";
import DepartmentRouter from "./modules/department/router/department.router";
import DepartmentDivisionRouter from "./modules/division/router/division.router";
import DepartmentDivisionEnrollmentRouter from "./modules/division-enrollment/router/enrollment.router";
import DepartmentDivisionProgramRouter from "./modules/program/router/program.router";
import PersonalAssignmentRouter from "./modules/personal-assignment/router/assignment.router";
import DepartmentDivisionProgramEnrollmentRouter from "./modules/program-enrollment/router/enrollment.router";
import EventRouter from "./modules/event/router/event.router";
import ReportRouter from "./modules/report/router/report.router";
import CourseClassAssignmentCompletionRouter from "./modules/assignment-completion/router/completion.router";
import ProductRouter from "./modules/product/router/product.router";
import ProductVariantRouter from "./modules/product-variant/router/variant.router";
import OrderRouter from "./modules/order/router/order.router";

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
  path: "/api/v1",
};
const personalAssignmentApi = {
  router: PersonalAssignmentRouter(getAuthMiddleWare()),
  path: "/api/v1",
};
const reportApi = {
  router: ReportRouter(getAuthMiddleWare()),
  path: "/api/v1",
};

const courseApi = {
  router: CourseRouter(getAuthMiddleWare()),
  path: "/api/v1",
};
const courseScheduleApi = {
  router: CourseScheduleRouter(getAuthMiddleWare()),
  path: "/api/v1",
};
const courseCategoryApi = {
  router: CourseCategoryRouter(getAuthMiddleWare()),
  path: "/api/v1",
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
const courseClassApi = {
  router: CourseClassRouter(getAuthMiddleWare()),
  path: "/api/v1",
};
const courseClassAssignmentApi = {
  router: CourseClassAssignmentRouter(getAuthMiddleWare()),
  path: "/api/v1",
};
const courseClassAssignmentCompletionApi = {
  router: CourseClassAssignmentCompletionRouter(getAuthMiddleWare()),
  path: "/api/v1",
};

const departmentApi = {
  router: DepartmentRouter(getAuthMiddleWare()),
  path: "/api/v1",
};
const departmentDivisionApi = {
  router: DepartmentDivisionRouter(getAuthMiddleWare()),
  path: "/api/v1",
};
const departmentDivisionEnrollmentApi = {
  router: DepartmentDivisionEnrollmentRouter(getAuthMiddleWare()),
  path: "/api/v1",
};
const departmentDivisionProgram = {
  router: DepartmentDivisionProgramRouter(getAuthMiddleWare()),
  path: "/api/v1",
};
const departmentDivisionProgramEnrollment = {
  router: DepartmentDivisionProgramEnrollmentRouter(getAuthMiddleWare()),
  path: "/api/v1",
};

const event = {
  router: EventRouter(getAuthMiddleWare()),
  path: "/api/v1",
};
const scholarshipApi = {
  router: ScholarshipRouter(getAuthMiddleWare()),
  path: "/api/v1",
};
const competitionApi = {
  router: CompetitionRouter(getAuthMiddleWare()),
  path: "/api/v1",
};
const productApi = {
  router: ProductRouter(getAuthMiddleWare()),
  path: "/api/v1",
};
const productVariantApi = {
  router: ProductVariantRouter(getAuthMiddleWare()),
  path: "/api/v1",
};
const orderApi = {
  router: OrderRouter(getAuthMiddleWare()),
  path: "/api/v1",
};

const routers: Api[] = [
  userApi,
  personalAssignmentApi,
  reportApi,
  courseApi,
  courseScheduleApi,
  courseCategoryApi,
  courseEnrollmentApi,
  courseLessonApi,
  courseLessonVideoApi,
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
