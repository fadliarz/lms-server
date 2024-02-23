import "reflect-metadata";

import express from "express";
import dIContainer from "../../../inversifyConfig";
import { CourseDITypes } from "../course.type";
import { courseUrls } from "../course.type";
import { ICourseController } from "../controller/course.controller";
import { NextFunction, Request, Response } from "express-serve-static-core";

export default function CourseRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<ICourseController>(
    CourseDITypes.CONTROLLER,
  );

  /**
   * Create (Course)
   *
   */
  router.post(
    "/",
    authenticationMiddleware,
    controller.createCourse.bind(controller),
  );

  /**
   * GetCourseById (Course)
   *
   */
  router.get(
    courseUrls.course,
    authenticationMiddleware,
    controller.getCourseById.bind(controller),
  );

  // router.get(
  //   "/",
  //   authenticationMiddleware,
  //   validationMiddleware({
  //     query: GetCoursesQueryJoi,
  //   }),
  //   authorizationMiddleware.(),
  //   controller.getCourses.bind(controller)
  // );

  /**
   * Update (Course)
   *
   */
  router.put(
    courseUrls.course,
    authenticationMiddleware,
    controller.updateBasicCourse.bind(controller),
  );

  /**
   * Delete (Course)
   *
   */
  router.delete(
    courseUrls.course,
    authenticationMiddleware,
    controller.deleteCourse.bind(controller),
  );

  // /**
  //  * Create (CourseLike)
  //  *
  //  */
  // router.post(
  //   courseUrls.likes,
  //   authenticationMiddleware,
  //   controller.createLike.bind(controller),
  // );
  //
  // /**
  //  * Delete (CourseLike)
  //  *
  //  */
  // router.delete(
  //   courseUrls.like,
  //   authenticationMiddleware,
  //   controller.deleteLike.bind(controller),
  // );

  return router;
}
