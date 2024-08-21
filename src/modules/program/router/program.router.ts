import express from "express";
import dIContainer from "../../../inversifyConfig";
import {
  $DepartmentProgramAPI,
  DepartmentProgramDITypes,
} from "../program.type";
import { IDepartmentProgramController } from "../program.interface";

export default function DepartmentDivisionProgramRouter(
  authenticationMiddleware: any,
) {
  const router = express.Router();

  const controller = dIContainer.get<IDepartmentProgramController>(
    DepartmentProgramDITypes.CONTROLLER,
  );

  /**
   * Create
   *
   */

  router.post(
    $DepartmentProgramAPI.CreateProgram.endpoint,
    authenticationMiddleware,
    controller.createProgram.bind(controller),
  );

  /**
   * Get
   *
   */

  router.get(
    $DepartmentProgramAPI.GetAllPrograms.endpoint,
    authenticationMiddleware,
    controller.getAllPrograms.bind(controller),
  );

  router.get(
    $DepartmentProgramAPI.GetPrograms.endpoint,
    authenticationMiddleware,
    controller.getPrograms.bind(controller),
  );

  router.get(
    $DepartmentProgramAPI.GetProgramById.endpoint,
    authenticationMiddleware,
    controller.getProgramById.bind(controller),
  );

  /**
   * Update
   *
   */
  router.patch(
    $DepartmentProgramAPI.UpdateProgram.endpoint,
    authenticationMiddleware,
    controller.updateProgram.bind(controller),
  );

  /**
   * Delete
   *
   */
  router.delete(
    $DepartmentProgramAPI.DeleteProgram.endpoint,
    authenticationMiddleware,
    controller.deleteProgram.bind(controller),
  );

  return router;
}
