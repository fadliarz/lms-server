import "reflect-metadata";
import express from "express";
import dIContainer from "../../../inversifyConfig";
import { CourseDITypes, courseUrls } from "../course.type";
import { ICourseController } from "../course.interface";

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

  router.post(
    courseUrls.likes,
    authenticationMiddleware,
    controller.createLike.bind(controller),
  );

  /**
   * Get
   *
   */
  router.get("/", controller.getCourses.bind(controller));

  router.get(
    courseUrls.enrolled,
    authenticationMiddleware,
    controller.getEnrolledCourses.bind(controller),
  );

  router.get(courseUrls.course, controller.getCourseById.bind(controller));

  /**
   * Update
   *
   */
  router.patch(
    courseUrls.basic,
    authenticationMiddleware,
    controller.updateBasicCourse.bind(controller),
  );

  router.patch(
    courseUrls.status,
    authenticationMiddleware,
    controller.updateCourseStatus.bind(controller),
  );

  router.patch(
    courseUrls.category,
    authenticationMiddleware,
    controller.updateCourseCategoryId.bind(controller),
  );

  router.patch(
    courseUrls.code,
    authenticationMiddleware,
    controller.updateCourseCode.bind(controller),
  );

  /**
   * Delete
   *
   */
  router.delete(
    courseUrls.course,
    authenticationMiddleware,
    controller.deleteCourse.bind(controller),
  );

  router.delete(
    courseUrls.like,
    authenticationMiddleware,
    controller.deleteLike.bind(controller),
  );

  return router;
}
