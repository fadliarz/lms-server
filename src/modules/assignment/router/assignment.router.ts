import express from "express";
import dIContainer from "../../../inversifyConfig";
import {
  CourseClassAssignmentDITypes,
  courseClassAssignmentUrls,
} from "../assignment.type";
import { ICourseClassAssignmentController } from "../assignment.interface";

export default function CourseClassAssignmentsRouter(
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
    courseClassAssignmentUrls.root,
    authenticationMiddleware,
    controller.createAssignment.bind(controller),
  );

  /**
   * Get
   *
   */
  router.get(
    courseClassAssignmentUrls.root,
    authenticationMiddleware,
    controller.getAssignments.bind(controller),
  );

  router.get(
    courseClassAssignmentUrls.assignment,
    authenticationMiddleware,
    controller.getAssignmentById.bind(controller),
  );

  /**
   * Update
   *
   */
  router.patch(
    courseClassAssignmentUrls.assignment,
    authenticationMiddleware,
    controller.updateAssignment.bind(controller),
  );

  /**
   * Delete
   *
   */
  router.delete(
    courseClassAssignmentUrls.assignment,
    authenticationMiddleware,
    controller.deleteAssignment.bind(controller),
  );

  return router;
}
