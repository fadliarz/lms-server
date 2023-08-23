import express from "express";
import dIContainer from "../../../inversifyConfig";
import { ICourseLessonVideoController } from "../controller/video.controller";
import { CourseLessonVideoDITypes, courseLessonVideoUrls } from "../video.type";
import { ICourseLessonVideoAuthorizationMiddleware } from "../authorization/video.authorization";
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
    validationMiddleware({
      body: CreateCourseLessonVideoJoi,
    }),
    authorizationMiddleware.getCreateVideoAuthorizationMiddleware(),
    controller.create.bind(controller)
  );

  router.put(
    courseLessonVideoUrls.video,
    authenticationMiddleware,
    validationMiddleware({
      body: UpdateCourseLessonVideoJoi,
    }),
    authorizationMiddleware.getUpdateVideoAuthorizationMiddleware(),
    controller.update.bind(controller)
  );

  router.delete(
    courseLessonVideoUrls.video,
    authenticationMiddleware,
    authorizationMiddleware.getDeleteVideoAuthorizationMiddleware(),
    controller.delete.bind(controller)
  );

  return router;
}
