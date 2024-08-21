import express from "express";
import dIContainer from "../../../inversifyConfig";
import {
  $DepartmentProgramEnrollmentAPI,
  DepartmentProgramEnrollmentDITypes,
} from "../enrollment.type";
import { IDepartmentProgramEnrollmentController } from "../enrollment.interface";

export default function DepartmentProgramEnrollmentRouter(
  authenticationMiddleware: any,
) {
  const router = express.Router();

  const controller = dIContainer.get<IDepartmentProgramEnrollmentController>(
    DepartmentProgramEnrollmentDITypes.CONTROLLER,
  );

  /**
   * Create
   *
   */

  router.post(
    $DepartmentProgramEnrollmentAPI.CreateEnrollment.endpoint,
    authenticationMiddleware,
    controller.createEnrollment.bind(controller),
  );

  /**
   * Delete
   *
   */

  router.delete(
    $DepartmentProgramEnrollmentAPI.DeleteEnrollment.endpoint,
    authenticationMiddleware,
    controller.deleteEnrollment.bind(controller),
  );

  return router;
}