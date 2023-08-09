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

export default function CourseRouter(
  authenticationMiddleware: any,
  authorizationMiddleware: any,
  courseAuthorizationMiddleware: any
) {
  const router = express.Router();

  const courseControllerInstance = dIContainer.get<ICourseController>(
    CourseDITypes.COURSE_CONTROLLER
  );

  router.get(
    "/",
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
    "/",
    authenticationMiddleware,
    authorizationMiddleware(Role.OWNER),
    validationMiddleware(CreateCourse, "body"),
    courseControllerInstance.createCourse.bind(courseControllerInstance)
  );

  router.put(
    courseUrls.course,
    authenticationMiddleware,
    validationMiddleware(UpdateCourse, "body"),
    authorizationMiddleware(Role.INSTRUCTOR),
    courseAuthorizationMiddleware(Role.INSTRUCTOR),
    courseControllerInstance.updateCourse.bind(courseControllerInstance)
  );

  router.put(
    courseUrls.likes,
    authenticationMiddleware,
    courseAuthorizationMiddleware([Role.STUDENT]),
    courseControllerInstance.setLike.bind(courseControllerInstance)
  );

  router.delete(
    courseUrls.course,
    authenticationMiddleware,
    authorizationMiddleware(Role.OWNER),
    courseControllerInstance.deleteCourse.bind(courseControllerInstance)
  );

  return router;
}
