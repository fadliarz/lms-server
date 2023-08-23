import express from "express";
import dIContainer from "../../../inversifyConfig";
import { CourseLessonDITypes, courseLessonUrls } from "../lesson.type";
import { ICourseLessonController } from "../controller/lesson.controller";
import { ICourseLessonAuthorizationMiddleware } from "../authorization/lesson.authorization";
import { validationMiddleware } from "../../../middlewares/validationMiddleware";
import {
  CreateCourseLessonDtoJoi,
  UpdateCourseLessonDtoJoi,
} from "../controller/lesson.joi";

export default function CourseLessonRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<ICourseLessonController>(
    CourseLessonDITypes.CONTROLLER
  );
  const authorizationMiddleware =
    dIContainer.get<ICourseLessonAuthorizationMiddleware>(
      CourseLessonDITypes.AUTHORIZATION_MIDDLEWARE
    );

  router.post(
    "/",
    authenticationMiddleware,
    validationMiddleware({
      body: CreateCourseLessonDtoJoi,
    }),
    authorizationMiddleware.getCreateLessonAuthorizationMiddleware(),
    controller.create.bind(controller)
  );

  router.get(
    courseLessonUrls.lesson,
    authenticationMiddleware,
    controller.getById.bind(controller)
  );

  router.put(
    courseLessonUrls.lesson,
    authenticationMiddleware,
    validationMiddleware({
      body: UpdateCourseLessonDtoJoi,
    }),
    authorizationMiddleware.getUpdateLessonAuthorizationMiddleware(),
    controller.update.bind(controller)
  );

  router.delete(
    courseLessonUrls.lesson,
    authenticationMiddleware,
    authorizationMiddleware.getDeleteLessonAuthorizationMiddleware(),
    controller.delete.bind(controller)
  );

  return router;
}
