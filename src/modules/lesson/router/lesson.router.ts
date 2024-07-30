import "reflect-metadata";
import express from "express";
import dIContainer from "../../../inversifyConfig";
import { CourseLessonDITypes, courseLessonUrls } from "../lesson.type";
import { ICourseLessonController } from "../lesson.interface";

export default function CourseLessonRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<ICourseLessonController>(
    CourseLessonDITypes.CONTROLLER,
  );

  /**
   * Create
   *
   */
  router.post(
    courseLessonUrls.lessons,
    authenticationMiddleware,
    controller.createLesson.bind(controller),
  );

  /**
   * Get
   *
   */
  router.get(
    courseLessonUrls.lesson,
    controller.getLessonById.bind(controller),
  );

  router.get(courseLessonUrls.lessons, controller.getLessons.bind(controller));

  /**
   * Update
   *
   */
  router.patch(
    courseLessonUrls.basic,
    authenticationMiddleware,
    controller.updateBasicLesson.bind(controller),
  );

  /**
   * Delete
   *
   */
  router.delete(
    courseLessonUrls.lesson,
    authenticationMiddleware,
    controller.deleteLesson.bind(controller),
  );

  return router;
}
