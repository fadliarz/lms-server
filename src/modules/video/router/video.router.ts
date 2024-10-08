import "reflect-metadata";
import express from "express";
import dIContainer from "../../../inversifyConfig";
import { CourseLessonVideoDITypes } from "../video.type";
import { ICourseLessonVideoController } from "../video.interface";
import { $CourseLessonVideoAPI } from "../video.api";

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
    $CourseLessonVideoAPI.CreateVideo.endpoint,
    authenticationMiddleware,
    controller.createVideo.bind(controller),
  );

  /**
   * Get
   *
   */
  router.get(
    $CourseLessonVideoAPI.GetVideos.endpoint,
    authenticationMiddleware,
    controller.getVideos.bind(controller),
  );

  router.get(
    $CourseLessonVideoAPI.GetVideoById.endpoint,
    authenticationMiddleware,
    controller.getVideoById.bind(controller),
  );

  /**
   * Update
   *
   */
  router.patch(
    $CourseLessonVideoAPI.UpdateVideo.endpoint,
    authenticationMiddleware,
    controller.updateVideo.bind(controller),
  );

  /**
   * Delete
   *
   */
  router.delete(
    $CourseLessonVideoAPI.DeleteVideo.endpoint,
    authenticationMiddleware,
    controller.deleteVideo.bind(controller),
  );

  return router;
}
