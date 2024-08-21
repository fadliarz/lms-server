import express from "express";
import dIContainer from "../../../inversifyConfig";
import { IScholarshipController } from "../scholarship.interface";
import { $ScholarshipAPI, ScholarshipDITypes } from "../scholarship.type";

export default function ScholarshipRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<IScholarshipController>(
    ScholarshipDITypes.CONTROLLER,
  );

  /**
   * Create
   *
   */

  router.post(
    $ScholarshipAPI.CreateScholarship.endpoint,
    authenticationMiddleware,
    controller.createScholarship.bind(controller),
  );

  /**
   * Get
   *
   */

  router.get(
    $ScholarshipAPI.GetScholarships.endpoint,
    authenticationMiddleware,
    controller.getScholarships.bind(controller),
  );

  router.get(
    $ScholarshipAPI.GetScholarshipById.endpoint,
    authenticationMiddleware,
    controller.getScholarshipById.bind(controller),
  );

  /**
   * Update
   *
   */

  router.patch(
    $ScholarshipAPI.UpdateScholarship.endpoint,
    authenticationMiddleware,
    controller.updateScholarship.bind(controller),
  );

  /**
   * Delete
   *
   */

  router.delete(
    $ScholarshipAPI.DeleteScholarship.endpoint,
    authenticationMiddleware,
    controller.deleteScholarship.bind(controller),
  );
  
  return router;
}
