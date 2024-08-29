import express from "express";
import dIContainer from "../../../inversifyConfig";
import { CourseClassAssignmentDITypes } from "../assignment.type";
import { ICourseClassAssignmentController } from "../assignment.interface";
import { $CourseClassAssignmentAPI } from "../assignment.api";

export default function CourseClassAssignmentRouter(
  authenticationMiddleware: any,
) {
  const router = express.Router();
  const controller = dIContainer.get<ICourseClassAssignmentController>(
    CourseClassAssignmentDITypes.CONTROLLER,
  );

  /**
   * Create
   *
   */

  router.post(
    $CourseClassAssignmentAPI.CreateAssignment.endpoint,
    authenticationMiddleware,
    controller.createAssignment.bind(controller),
  );

  /**
   * Get
   *
   */

  router.get(
    $CourseClassAssignmentAPI.GetAssignments.endpoint,
    authenticationMiddleware,
    controller.getAssignments.bind(controller),
  );

  router.get(
    $CourseClassAssignmentAPI.GetAssignmentById.endpoint,
    authenticationMiddleware,
    controller.getAssignmentById.bind(controller),
  );

  /**
   * Update
   *
   */

  router.patch(
    $CourseClassAssignmentAPI.UpdateAssignment.endpoint,
    authenticationMiddleware,
    controller.updateAssignment.bind(controller),
  );

  /**
   * Delete
   *
   */

  router.delete(
    $CourseClassAssignmentAPI.DeleteAssignment.endpoint,
    authenticationMiddleware,
    controller.deleteAssignment.bind(controller),
  );

  return router;
}
