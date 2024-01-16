import express from "express";
import dIContainer from "../../../inversifyConfig";
import { CourseDITypes } from "../course.type";
import { courseUrls } from "../course.type";
import { ICourseController } from "../controller/course.controller";
import { CourseAuthorizationMiddleware } from "../authorization/course.authorization";

export default function CourseRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<ICourseController>(
    CourseDITypes.CONTROLLER
  );
  const authorizationMiddleware = new CourseAuthorizationMiddleware();

  /**
   * Create (Course)
   *
   */
  router.post(
    "/",
    authenticationMiddleware,
    authorizationMiddleware.getCreateCourseAuthorizationMiddleware(),
    controller.createCourse.bind(controller)
  );

  /**
   * GetCourseById (Course)
   * 
   */
  router.get(
    courseUrls.course,
    authenticationMiddleware,
    controller.getCourseById.bind(controller)
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
    authorizationMiddleware.getUpdateCourseAuthorizationMiddleware(),
    controller.updateCourse.bind(controller)
  );

  /**
   * Delete (Course)
   *
   */
  router.delete(
    courseUrls.course,
    authenticationMiddleware,
    authorizationMiddleware.getDeleteCourseAuthorizationMiddleware(),
    controller.deleteCourse.bind(controller)
  );

  /**
   * Create (CourseLike)
   *
   */
  router.post(
    courseUrls.likes,
    authenticationMiddleware,
    authorizationMiddleware.getCreateCourseLikeAuthorization(),
    controller.createLike.bind(controller)
  );

  /**
   * Delete (CourseLike)
   *
   */
  router.delete(
    courseUrls.like,
    authenticationMiddleware,
    authorizationMiddleware.getDeleteCourseLikeAuthorization(),
    controller.deleteLike.bind(controller)
  );

  return router;
}
