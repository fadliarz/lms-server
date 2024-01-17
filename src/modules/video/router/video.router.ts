import "reflect-metadata";

import express from "express";
import dIContainer from "../../../inversifyConfig";
import { ICourseLessonVideoController } from "../controller/video.controller";
import { CourseLessonVideoDITypes, courseLessonVideoUrls } from "../video.type";
import {
  CourseLessonVideoAuthorizationMiddleware,
  ICourseLessonVideoAuthorizationMiddleware,
} from "../authorization/video.authorization";
import { validationMiddleware } from "../../../middlewares/validationMiddleware";
import {
  CreateCourseLessonVideoJoi,
  UpdateCourseLessonVideoJoi,
} from "../controller/video.joi";

export default function CourseLessonVideoRouter(authenticationMiddleware: any) {
  const router = express.Router();
  const controller = dIContainer.get<ICourseLessonVideoController>(
    CourseLessonVideoDITypes.CONTROLLER
  );
  const authorizationMiddleware =
    new CourseLessonVideoAuthorizationMiddleware();

  /**
   * Create
   *
   */
  router.post(
    courseLessonVideoUrls.root,
    authenticationMiddleware,
    validationMiddleware({
      body: CreateCourseLessonVideoJoi,
    }),
    authorizationMiddleware.getCreateVideoAuthorizationMiddleware(),
    controller.createVideo.bind(controller)
  );

  /**
   * Get
   *
   */

  /**
   * Update
   *
   */
  router.put(
    courseLessonVideoUrls.video,
    authenticationMiddleware,
    validationMiddleware({
      body: UpdateCourseLessonVideoJoi,
    }),
    authorizationMiddleware.getUpdateVideoAuthorizationMiddleware(),
    controller.updateVideo.bind(controller)
  );

  /**
   * Delete
   *
   */
  router.delete(
    courseLessonVideoUrls.video,
    authenticationMiddleware,
    authorizationMiddleware.getDeleteVideoAuthorizationMiddleware(),
    controller.deleteVideo.bind(controller)
  );

  return router;
}
