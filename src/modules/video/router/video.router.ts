import "reflect-metadata";
import express from "express";
import dIContainer from "../../../inversifyConfig";
import { ICourseLessonVideoController } from "../controller/video.controller";
import { CourseLessonVideoDITypes, courseLessonVideoUrls } from "../video.type";

export default function CourseLessonVideoRouter(authenticationMiddleware: any) {
  const router = express.Router();
  const controller = dIContainer.get<ICourseLessonVideoController>(
    CourseLessonVideoDITypes.CONTROLLER,
  );

  /**
   * Create
   *
   */
  router.post(
    courseLessonVideoUrls.root,
    authenticationMiddleware,
    controller.createVideo.bind(controller),
  );

  /**
   * Get
   *
   */
  router.post(
    courseLessonVideoUrls.video,
    authenticationMiddleware,
    controller.getVideoById.bind(controller),
  );

  /**
   * Update
   *
   */
  router.put(
    courseLessonVideoUrls.source,
    authenticationMiddleware,
    controller.updateVideoSource.bind(controller),
  );

  /**
   * Delete
   *
   */
  router.delete(
    courseLessonVideoUrls.video,
    authenticationMiddleware,
    controller.deleteVideo.bind(controller),
  );

  return router;
}
