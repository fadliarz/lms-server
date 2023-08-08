import express from "express";
import dIContainer from "../../../inversifyConfig";
import { Role } from "@prisma/client";
import { validationMiddleware } from "../../../middlewares/validationMiddleware";
import { getAuthMiddleWare } from "../../../middlewares/getAuthMiddleware";
import { ICourseLessonVideoController } from "../controller/video.controller";
import { CourseLessonVideoDITypes, courseLessonVideoUrls } from "../video.type";
import {
  CreateCourseLessonVideo,
  UpdateCourseLessonVideo,
} from "../controller/video.joi";

export default function CourseLessonVideoRouter(
  authorizationMiddleware: any,
  authenticationMiddleware: any
) {
  const router = express.Router();

  const courseLessonVideoControllerInstance =
    dIContainer.get<ICourseLessonVideoController>(
      CourseLessonVideoDITypes.COURSE_LESSON_VIDEO_CONTROLLER
    );

  router.post(
    courseLessonVideoUrls.video,
    authenticationMiddleware,
    authorizationMiddleware([Role.INSTRUCTOR]),
    validationMiddleware(CreateCourseLessonVideo, "body"),
    getAuthMiddleWare(),
    courseLessonVideoControllerInstance.createVideo.bind(
      courseLessonVideoControllerInstance
    )
  );

  router.put(
    courseLessonVideoUrls.video,
    authenticationMiddleware,
    authorizationMiddleware([Role.INSTRUCTOR]),
    validationMiddleware(UpdateCourseLessonVideo, "body"),
    courseLessonVideoControllerInstance.updateVideo.bind(
      courseLessonVideoControllerInstance
    )
  );

  router.delete(
    courseLessonVideoUrls.video,
    authenticationMiddleware,
    authorizationMiddleware([Role.INSTRUCTOR]),
    courseLessonVideoControllerInstance.deleteVideo.bind(
      courseLessonVideoControllerInstance
    )
  );

  return router;
}
