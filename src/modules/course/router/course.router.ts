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
   * CreateCourse
   *
   */
  router.post(
    "/",
    authenticationMiddleware,
    controller.createCourse.bind(controller),
  );

  /**
   * GetCourseById
   *
   */
  router.get(
    courseUrls.course,
    controller.getCourseById.bind(controller),
  );

  /**
   * GetCourses
   *
   */
  router.get(
    "/",
    controller.getCourses.bind(controller)
  );

  /**
   * GetEnrolledCourses
   *
   */
  router.get(
    courseUrls.enrolled,
    authenticationMiddleware,
    controller.getEnrolledCourses.bind(controller)
  );

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

  /**
   * Create (CourseLike)
   *
   */
  router.post(
    courseUrls.likes,
    authenticationMiddleware,
    controller.createLike.bind(controller),
  );

  /**
   * Delete (CourseLike)
   *
   */
  router.delete(
    courseUrls.like,
    authenticationMiddleware,
    controller.deleteLike.bind(controller),
  );

  return router;
}
