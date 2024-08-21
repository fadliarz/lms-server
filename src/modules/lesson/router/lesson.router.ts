import "reflect-metadata";
import express from "express";
import dIContainer from "../../../inversifyConfig";
import { $CourseLessonAPI, CourseLessonDITypes } from "../lesson.type";
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
    $CourseLessonAPI.CreateLesson.endpoint,
    authenticationMiddleware,
    controller.createLesson.bind(controller),
  );

  /**
   * Get
   *
   */

  router.get(
    $CourseLessonAPI.GetLessons.endpoint,
    controller.getLessons.bind(controller),
  );

  router.get(
    $CourseLessonAPI.GetLessonById.endpoint,
    controller.getLessonById.bind(controller),
  );

  /**
   * Update
   *
   */

  router.patch(
    $CourseLessonAPI.UpdateLesson.endpoint,
    authenticationMiddleware,
    controller.updateLesson.bind(controller),
  );

  /**
   * Delete
   *
   */

  router.delete(
    $CourseLessonAPI.DeleteLesson.endpoint,
    authenticationMiddleware,
    controller.deleteLesson.bind(controller),
  );

  return router;
}
