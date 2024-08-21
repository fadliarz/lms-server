import "reflect-metadata";
import express from "express";
import dIContainer from "../../../inversifyConfig";
import { $CourseAPI, CourseDITypes } from "../course.type";
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
    $CourseAPI.CreateCourse.endpoint,
    authenticationMiddleware,
    controller.createCourse.bind(controller),
  );

  router.post(
    $CourseAPI.CreateLike.endpoint,
    authenticationMiddleware,
    controller.createLike.bind(controller),
  );

  /**
   * Get
   *
   */

  router.get(
    $CourseAPI.GetCourses.endpoint,
    controller.getCourses.bind(controller),
  );

  router.get(
    $CourseAPI.GetCourseById.endpoint,
    controller.getCourseById.bind(controller),
  );

  /**
   * Update
   *
   */

  router.patch(
    $CourseAPI.UpdateCourse.endpoint,
    authenticationMiddleware,
    controller.updateCourse.bind(controller),
  );

  router.patch(
    $CourseAPI.UpdateCourseStatus.endpoint,
    authenticationMiddleware,
    controller.updateCourseStatus.bind(controller),
  );

  router.patch(
    $CourseAPI.UpdateCourseCategoryId.endpoint,
    authenticationMiddleware,
    controller.updateCourseCategoryId.bind(controller),
  );

  router.patch(
    $CourseAPI.UpdateCourseCode.endpoint,
    authenticationMiddleware,
    controller.updateCourseCode.bind(controller),
  );

  /**
   * Delete
   *
   */

  router.delete(
    $CourseAPI.DeleteCourse.endpoint,
    authenticationMiddleware,
    controller.deleteCourse.bind(controller),
  );

  router.delete(
    $CourseAPI.DeleteLike.endpoint,
    authenticationMiddleware,
    controller.deleteLike.bind(controller),
  );

  return router;
}
