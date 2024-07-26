import express from "express";
import dIContainer from "../../../inversifyConfig";
import {
  CourseClassDITypes,
  courseClassUrls,
  ICourseClassController,
} from "../class.type";

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
    courseClassUrls.root,
    authenticationMiddleware,
    controller.createClass.bind(controller),
  );

  /**
   * Get
   *
   */
  router.get(
    courseClassUrls.class,
    authenticationMiddleware,
    controller.getClassById.bind(controller),
  );

  router.get(
    courseClassUrls.root,
    authenticationMiddleware,
    controller.getClasses.bind(controller),
  );

  /**
   * Update
   *
   */
  router.patch(
    courseClassUrls.class,
    authenticationMiddleware,
    controller.updateClass.bind(controller),
  );

  /**
   * Delete
   *
   */
  router.delete(
    courseClassUrls.class,
    authenticationMiddleware,
    controller.deleteClass.bind(controller),
  );
}
