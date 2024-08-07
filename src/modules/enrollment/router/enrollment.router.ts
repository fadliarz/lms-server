import "reflect-metadata";
import express from "express";
import dIContainer from "../../../inversifyConfig";
import {
  CourseEnrollmentDITypes,
  courseEnrollmentUrls,
} from "../enrollment.type";
import { ICourseEnrollmentController } from "../enrollment.interface";

export default function CourseEnrollmentRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<ICourseEnrollmentController>(
    CourseEnrollmentDITypes.CONTROLLER,
  );

  /**
   * Create
   *
   */
  router.post(
    courseEnrollmentUrls.root,
    authenticationMiddleware,
    controller.createEnrollment.bind(controller),
  );

  /**
   * Update
   *
   */
  router.patch(
    courseEnrollmentUrls.role,
    authenticationMiddleware,
    controller.updateEnrollmentRole.bind(controller),
  );

  /**
   * Delete
   *
   */
  router.delete(
    courseEnrollmentUrls.enrollment,
    authenticationMiddleware,
    controller.deleteEnrollment.bind(controller),
  );

  return router;
}
