import express from "express";
import dIContainer from "../../../inversifyConfig";
import { IPersonalAssignmentController } from "../assignment.interface";
import {
  $PersonalAssignmentAPI,
  PersonalAssignmentDITypes,
} from "../assignment.type";

export default function PersonalAssignmentRouter(
  authenticationMiddleware: any,
) {
  const router = express.Router();

  const controller = dIContainer.get<IPersonalAssignmentController>(
    PersonalAssignmentDITypes.CONTROLLER,
  );

  /**
   * Create
   *
   */

  router.post(
    $PersonalAssignmentAPI.CreateAssignment.endpoint,
    authenticationMiddleware,
    controller.createAssignment.bind(controller),
  );

  /**
   * Update
   *
   */

  router.patch(
    $PersonalAssignmentAPI.UpdateAssignment.endpoint,
    authenticationMiddleware,
    controller.updateAssignment.bind(controller),
  );

  /**
   * Delete
   *
   */

  router.delete(
    $PersonalAssignmentAPI.DeleteAssignment.endpoint,
    authenticationMiddleware,
    controller.deleteAssignment.bind(controller),
  );

  return router;
}
