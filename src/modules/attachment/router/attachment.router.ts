import "reflect-metadata";
import express from "express";
import dIContainer from "../../../inversifyConfig";
import { ICourseLessonAttachmentController } from "../attachment.interface";
import { CourseLessonAttachmentDITypes } from "../attachment.type";
import { $CourseLessonAttachmentAPI } from "../attachment.api";

export default function CourseLessonAttachmentRouter(
  authenticationMiddleware: any,
) {
  const router = express.Router();
  const controller = dIContainer.get<ICourseLessonAttachmentController>(
    CourseLessonAttachmentDITypes.CONTROLLER,
  );

  /**
   * Create
   *
   */
  router.post(
    $CourseLessonAttachmentAPI.CreateAttachment.endpoint,
    authenticationMiddleware,
    controller.createAttachment.bind(controller),
  );

  /**
   * Get
   *
   */
  router.get(
    $CourseLessonAttachmentAPI.GetAttachments.endpoint,
    authenticationMiddleware,
    controller.getAttachments.bind(controller),
  );

  router.get(
    $CourseLessonAttachmentAPI.GetAttachmentById.endpoint,
    authenticationMiddleware,
    controller.getAttachmentById.bind(controller),
  );

  /**
   * Update
   *
   */
  router.patch(
    $CourseLessonAttachmentAPI.UpdateAttachment.endpoint,
    authenticationMiddleware,
    controller.updateAttachment.bind(controller),
  );

  /**
   * Delete
   *
   */
  router.delete(
    $CourseLessonAttachmentAPI.DeleteAttachment.endpoint,
    authenticationMiddleware,
    controller.deleteAttachment.bind(controller),
  );

  return router;
}
