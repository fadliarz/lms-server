import express from "express";
import dIContainer from "../../../inversifyConfig";
import { IDepartmentDivisionEnrollmentController } from "../enrollment.interface";
import {
  $DepartmentDivisionEnrollmentAPI,
  DepartmentDivisionEnrollmentDITypes,
} from "../enrollment.type";

export default function DepartmentDivisionEnrollmentRouter(
  authenticationMiddleware: any,
) {
  const router = express.Router();

  const controller = dIContainer.get<IDepartmentDivisionEnrollmentController>(
    DepartmentDivisionEnrollmentDITypes.CONTROLLER,
  );

  /**
   * Create
   *
   */

  router.post(
    $DepartmentDivisionEnrollmentAPI.CreateEnrollment.endpoint,
    authenticationMiddleware,
    controller.createEnrollment.bind(controller),
  );

  /**
   * Get
   *
   */

  router.get(
    $DepartmentDivisionEnrollmentAPI.GetEnrollments.endpoint,
    authenticationMiddleware,
    controller.getEnrollments.bind(controller),
  );

  /**
   * Delete
   *
   */

  router.delete(
    $DepartmentDivisionEnrollmentAPI.DeleteEnrollment.endpoint,
    authenticationMiddleware,
    controller.deleteEnrollment.bind(controller),
  );

  return router;
}
