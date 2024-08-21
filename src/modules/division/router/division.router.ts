import express from "express";
import dIContainer from "../../../inversifyConfig";
import { IDepartmentDivisionController } from "../division.interface";
import {
  $DepartmentDivisionAPI,
  DepartmentDivisionDITypes,
} from "../division.type";

export default function DepartmentDivisionRouter(
  authenticationMiddleware: any,
) {
  const router = express.Router();

  const controller = dIContainer.get<IDepartmentDivisionController>(
    DepartmentDivisionDITypes.CONTROLLER,
  );

  /**
   * Create
   *
   */

  router.post(
    $DepartmentDivisionAPI.CreateDivision.endpoint,
    authenticationMiddleware,
    controller.createDivision.bind(controller),
  );

  /**
   * Get
   *
   */

  router.get(
    $DepartmentDivisionAPI.GetDivisions.endpoint,
    authenticationMiddleware,
    controller.getDivisions.bind(controller),
  );

  router.get(
    $DepartmentDivisionAPI.GetDivisionById.endpoint,
    authenticationMiddleware,
    controller.getDivisionById.bind(controller),
  );

  /**
   * Update
   *
   */

  router.patch(
    $DepartmentDivisionAPI.UpdateDivision.endpoint,
    authenticationMiddleware,
    controller.updateDivision.bind(controller),
  );

  router.patch(
    $DepartmentDivisionAPI.UpdateDivisionLeaderId.endpoint,
    authenticationMiddleware,
    controller.updateDivisionLeaderId.bind(controller),
  );

  router.patch(
    $DepartmentDivisionAPI.UpdateDivisionCoLeaderId.endpoint,
    authenticationMiddleware,
    controller.updateDivisionCoLeaderId.bind(controller),
  );

  /**
   * Delete
   *
   */

  router.delete(
    $DepartmentDivisionAPI.DeleteDivision.endpoint,
    authenticationMiddleware,
    controller.deleteDivision.bind(controller),
  );

  return router;
}
