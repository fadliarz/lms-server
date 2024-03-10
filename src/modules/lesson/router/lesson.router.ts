import "reflect-metadata";

import express from "express";
import dIContainer from "../../../inversifyConfig";
import { CourseLessonDITypes, courseLessonUrls } from "../lesson.type";
import { ICourseLessonController } from "../controller/lesson.controller";
import { validationMiddleware } from "../../../middlewares/validationMiddleware";
import {
  CreateCourseLessonDtoJoi,
  UpdateCourseLessonDtoJoi,
} from "../controller/lesson.joi";

export default function CourseLessonRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<ICourseLessonController>(
    CourseLessonDITypes.CONTROLLER,
  );

  router.post(
    "/",
    authenticationMiddleware,
    controller.createLesson.bind(controller),
  );

  router.get(
    courseLessonUrls.lesson,
    controller.getLessonById.bind(controller),
  );

  router.put(
    courseLessonUrls.lesson,
    authenticationMiddleware,
    controller.updateLesson.bind(controller),
  );

  router.delete(
    courseLessonUrls.lesson,
    authenticationMiddleware,
    controller.deleteLesson.bind(controller),
  );

  return router;
}
