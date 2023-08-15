import express from "express";
import dIContainer from "../../../inversifyConfig";
import { CourseLessonDITypes, courseLessonUrls } from "../lesson.type";
import { ICourseLessonController } from "../controller/lesson.controller";
import { ICourseLessonAuthorizationMiddleware } from "../authorization/lesson.authorization";
import { validationMiddleware } from "../../../middlewares/validationMiddleware";
import {
  CreateCourseLesson,
  UpdateCourseLesson,
} from "../controller/lesson.joi";

export default function CourseLessonRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<ICourseLessonController>(
    CourseLessonDITypes.CONTROLLER
  );
  const authorizationMiddlewrae =
    dIContainer.get<ICourseLessonAuthorizationMiddleware>(
      CourseLessonDITypes.AUTHORIZATION_MIDDLEWARE
    );

  router.post(
    "/",
    authenticationMiddleware,
    authorizationMiddlewrae.getCreateLessonAuthorizationMiddleware(),
    validationMiddleware({
      body: CreateCourseLesson,
    }),
    controller.createLesson.bind(controller)
  );

  router.put(
    courseLessonUrls.lesson,
    authenticationMiddleware,
    authorizationMiddlewrae.getUpdateLessonAuthorizationMiddleware(),
    validationMiddleware({
      body: UpdateCourseLesson,
    }),
    controller.updateLesson.bind(controller)
  );

  router.delete(
    courseLessonUrls.lesson,
    authenticationMiddleware,
    authenticationMiddleware.getDeleteLessonAuthorizationMiddleware(),
    controller.deleteLesson.bind(controller)
  );

  return router;
}
