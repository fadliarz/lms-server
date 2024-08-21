import express from "express";
import dIContainer from "../../../inversifyConfig";
import { IDepartmentController } from "../department.interface";
import { $DepartmentAPI, DepartmentDITypes } from "../department.type";

export default function DepartmentRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<IDepartmentController>(
    DepartmentDITypes.CONTROLLER,
  );

  /**
   * Create
   *
   */

  router.post(
    $DepartmentAPI.CreateDepartment.endpoint,
    authenticationMiddleware,
    controller.createDepartment.bind(controller),
  );

  /**
   * Get
   *
   */

  router.get(
    $DepartmentAPI.GetDepartments.endpoint,
    authenticationMiddleware,
    controller.getDepartments.bind(controller),
  );

  router.get(
    $DepartmentAPI.GetDepartmentById.endpoint,
    authenticationMiddleware,
    controller.getDepartmentById.bind(controller),
  );

  /**
   * Update
   *
   */

  router.patch(
    $DepartmentAPI.UpdateDepartment.endpoint,
    authenticationMiddleware,
    controller.updateDepartment.bind(controller),
  );

  router.patch(
    $DepartmentAPI.UpdateDepartmentLeaderId.endpoint,
    authenticationMiddleware,
    controller.updateDepartmentLeaderId.bind(controller),
  );

  router.patch(
    $DepartmentAPI.UpdateDepartmentCoLeaderId.endpoint,
    authenticationMiddleware,
    controller.updateDepartmentCoLeaderId.bind(controller),
  );

  /**
   * Delete
   *
   */

  router.delete(
    $DepartmentAPI.DeleteDepartment.endpoint,
    authenticationMiddleware,
    controller.deleteDepartment.bind(controller),
  );

  return router;
}
