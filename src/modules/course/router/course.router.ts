import express from "express";
import dIContainer from "../../../inversifyConfig";
import { CourseDITypes } from "../course.type";
import { courseUrls } from "../course.type";
import { ICourseController } from "../controller/course.controller";
import { ICourseAuthorizationMiddleware } from "../authorization/course.authorization";
import { validationMiddleware } from "../../../middlewares/validationMiddleware";
import {
  CreateCourseDtoJoi,
  GetCourseQueryJoi,
  GetCoursesQueryJoi,
  UpdateCourseDtoJoi,
} from "../controller/course.joi";

export default function CourseRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<ICourseController>(
    CourseDITypes.CONTROLLER
  );
  const authorizationMiddleware =
    dIContainer.get<ICourseAuthorizationMiddleware>(
      CourseDITypes.AUTHORIZATION_MIDDLEWARE
    );

  router.post(
    courseUrls.course,
    authenticationMiddleware,
    authorizationMiddleware.getCreateCourseAuthorization(),
    validationMiddleware({
      body: CreateCourseDtoJoi,
    }),
    controller.createCourse.bind(controller)
  );

  router.get(
    "/",
    authenticationMiddleware,
    validationMiddleware({
      query: GetCoursesQueryJoi,
    }),
    controller.getCourses.bind(controller)
  );

  router.get(
    courseUrls.course,
    authenticationMiddleware,
    authorizationMiddleware.getCourseByIdAuthorization(),
    validationMiddleware({
      query: GetCourseQueryJoi,
    }),
    controller.getCourseById.bind(controller)
  );

  router.put(
    courseUrls.course,
    authenticationMiddleware,
    authenticationMiddleware.getUpdateCourseAuthorization(),
    validationMiddleware({
      body: UpdateCourseDtoJoi,
    }),
    controller.updateCourse.bind(controller)
  );

  router.delete(
    courseUrls.course,
    authenticationMiddleware,
    authorizationMiddleware.getDeleteCourseAuthorization(),
    controller.deleteCourse.bind(controller)
  );

  router.post(
    courseUrls.likes,
    authenticationMiddleware,
    authorizationMiddleware.getCreateCourseLikeAuthorization(),
    controller.createCourseLike.bind(controller)
  );

  router.delete(
    courseUrls.like,
    authenticationMiddleware,
    authorizationMiddleware.getDeleteCourseLikeAuthorization(),
    controller.deleteCourseLike.bind(controller)
  );

  return router;
}
