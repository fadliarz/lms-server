import express from "express";
import dIContainer from "../../../inversifyConfig";
import { CourseDITypes } from "../course.type";
import { courseUrls } from "../course.type";
import { Role } from "@prisma/client";
import { ICourseController } from "../controller/course.controller";
import {
  CreateCourse,
  GetCourseQueryJoi,
  UpdateCourse,
  GetCoursesQueryJoi,
} from "../controller/course.joi";
import { validationMiddleware } from "../../../middlewares/validationMiddleware";
import { getAuthMiddleWare } from "../../../middlewares/getAuthMiddleware";

export default function CourseRouter(
  authorizationMiddleware: any,
  authenticationMiddleware: any
) {
  const router = express.Router();

  const courseControllerInstance = dIContainer.get<ICourseController>(
    CourseDITypes.COURSE_CONTROLLER
  );

  router.get(
    "",
    authenticationMiddleware,
    validationMiddleware(GetCoursesQueryJoi, "query"),
    courseControllerInstance.getCourses.bind(courseControllerInstance)
  );

  router.get(
    courseUrls.course,
    validationMiddleware(GetCourseQueryJoi, "query"),
    courseControllerInstance.getCourseById.bind(courseControllerInstance)
  );

  router.post(
    courseUrls.course,
    authenticationMiddleware,
    authorizationMiddleware([Role.INSTRUCTOR]),
    validationMiddleware(CreateCourse, "body"),
    courseControllerInstance.createCourse.bind(courseControllerInstance)
  );

  router.put(
    courseUrls.course,
    authenticationMiddleware,
    validationMiddleware(UpdateCourse, "body"),
    courseControllerInstance.updateCourse.bind(courseControllerInstance)
  );

  router.put(
    courseUrls.likes,
    authenticationMiddleware,
    courseControllerInstance.setLike.bind(courseControllerInstance)
  );

  return router;
}
