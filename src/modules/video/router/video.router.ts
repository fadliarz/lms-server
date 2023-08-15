import express from "express";
import dIContainer from "../../../inversifyConfig";
import { ICourseLessonVideoController } from "../controller/video.controller";
import { CourseLessonVideoDITypes, courseLessonVideoUrls } from "../video.type";
import { ICourseLessonVideoAuthorizationMiddleware } from "../authorization/lesson.authorization";
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
    dIContainer.get<ICourseLessonVideoAuthorizationMiddleware>(
      CourseLessonVideoDITypes.AUTHORIZATION_MIDDLEWARE
    );

  router.post(
    "/",
    authenticationMiddleware,
    authorizationMiddleware.getCreateLessonAuthorizationMiddleware(),
    validationMiddleware({
      body: CreateCourseLessonVideoJoi,
    }),
    controller.createVideo.bind(controller)
  );

  router.put(
    courseLessonVideoUrls.video,
    authenticationMiddleware,
    authorizationMiddleware.getUpdateLessonAuthorizationMiddleware(),
    validationMiddleware({
      body: UpdateCourseLessonVideoJoi,
    }),
    controller.updateVideo.bind(controller)
  );

  router.delete(
    courseLessonVideoUrls.video,
    authenticationMiddleware,
    authorizationMiddleware.getDeleteLessonAuthorizationMiddleware(),
    controller.deleteVideo.bind(controller)
  );

  return router;
}
