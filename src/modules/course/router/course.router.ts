import express from "express";
import dIContainer from "../../../inversifyConfig";
import { CourseDITypes } from "../course.type";
import { courseUrls } from "../course.type";
import { ICourseController } from "../controller/course.controller";
import { ICourseAuthorizationMiddleware } from "../authorization/course.authorization";
import { validationMiddleware } from "../../../middlewares/validationMiddleware";
import {
  CreateCourseDtoJoi,
  CreateCourseLikeDtoJoi,
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

  router.get(courseUrls.category, controller.getCategories.bind(controller));

  router.post(
    "/",
    authenticationMiddleware,
    authorizationMiddleware.getCreateCourseAuthorization(),
    validationMiddleware({
      body: CreateCourseDtoJoi,
    }),
    controller.create.bind(controller)
  );

  router.get(
    "/",
    authenticationMiddleware,
    validationMiddleware({
      query: GetCoursesQueryJoi,
    }),
    authorizationMiddleware.getCoursesAuthorization(),
    controller.getMany.bind(controller)
  );

  router.get(
    courseUrls.course,
    authenticationMiddleware,
    validationMiddleware({
      query: GetCourseQueryJoi,
    }),
    authorizationMiddleware.getCourseByIdAuthorization(),
    controller.getById.bind(controller)
  );

  router.put(
    courseUrls.course,
    authenticationMiddleware,
    authorizationMiddleware.getUpdateCourseAuthorization(),
    validationMiddleware({
      body: UpdateCourseDtoJoi,
    }),
    controller.update.bind(controller)
  );

  router.delete(
    courseUrls.course,
    authenticationMiddleware,
    authorizationMiddleware.getDeleteCourseAuthorization(),
    controller.delete.bind(controller)
  );

  router.post(
    courseUrls.likes,
    authenticationMiddleware,
    validationMiddleware({
      body: CreateCourseLikeDtoJoi,
    }),
    authorizationMiddleware.getCreateCourseLikeAuthorization(),
    controller.createLike.bind(controller)
  );

  router.delete(
    courseUrls.like,
    authenticationMiddleware,
    authorizationMiddleware.getDeleteCourseLikeAuthorization(),
    controller.deleteLike.bind(controller)
  );

  return router;
}
