import "reflect-metadata";
import express from "express";
import dIContainer from "../../../inversifyConfig";
import { CourseEnrollmentDITypes } from "../enrollment.type";
import { ICourseEnrollmentController } from "../enrollment.interface";
import { $CourseEnrollmentAPI } from "../enrollment.api";

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
    $CourseEnrollmentAPI.CreateEnrollment.endpoint,
    authenticationMiddleware,
    controller.createEnrollment.bind(controller),
  );

  /**
   * Update
   *
   */

  router.patch(
    $CourseEnrollmentAPI.UpdateEnrollment.endpoint,
    authenticationMiddleware,
    controller.updateEnrollment.bind(controller),
  );

  /**
   * Delete
   *
   */

  router.delete(
    $CourseEnrollmentAPI.DeleteEnrollment.endpoint,
    authenticationMiddleware,
    controller.deleteEnrollment.bind(controller),
  );

  return router;
}
