import express from "express";
import dIContainer from "../../../inversifyConfig";
import { ICourseClassAssignmentCompletionController } from "../completion.interface";
import {
  $CourseClassAssignmentCompletionAPI,
  CourseClassAssignmentCompletionDITypes,
} from "../completion.type";

export default function CourseClassAssignmentCompletionRouter(
  authenticationMiddleware: any,
) {
  const router = express.Router();

  const controller =
    dIContainer.get<ICourseClassAssignmentCompletionController>(
      CourseClassAssignmentCompletionDITypes.CONTROLLER,
    );

  /**
   * Create
   *
   */

  router.post(
    $CourseClassAssignmentCompletionAPI.CreateCompletion.endpoint,
    authenticationMiddleware,
    controller.createCompletion.bind(controller),
  );

  /**
   * Delete
   *
   */

  router.delete(
    $CourseClassAssignmentCompletionAPI.DeleteCompletion.endpoint,
    authenticationMiddleware,
    controller.deleteCompletion.bind(controller),
  );

  return router;
}
