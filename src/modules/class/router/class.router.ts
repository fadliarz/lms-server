import express from "express";
import dIContainer from "../../../inversifyConfig";
import { $CourseClassAPI, CourseClassDITypes } from "../class.type";
import { ICourseClassController } from "../class.interface";

export default function CourseClassRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<ICourseClassController>(
    CourseClassDITypes.CONTROLLER,
  );

  /**
   * Create
   *
   */

  router.post(
    $CourseClassAPI.CreateClass.endpoint,
    authenticationMiddleware,
    controller.createClass.bind(controller),
  );

  /**
   * Get
   *
   */

  router.get(
    $CourseClassAPI.GetClasses.endpoint,
    authenticationMiddleware,
    controller.getClasses.bind(controller),
  );

  router.get(
    $CourseClassAPI.GetClassById.endpoint,
    authenticationMiddleware,
    controller.getClassById.bind(controller),
  );

  /**
   * Update
   *
   */

  router.patch(
    $CourseClassAPI.UpdateClass.endpoint,
    authenticationMiddleware,
    controller.updateClass.bind(controller),
  );

  /**
   * Delete
   *
   */

  router.delete(
    $CourseClassAPI.DeleteClass.endpoint,
    authenticationMiddleware,
    controller.deleteClass.bind(controller),
  );

  return router;
}
