import express from "express";
import dIContainer from "../../../inversifyConfig";
import { Role } from "@prisma/client";
import { validationMiddleware } from "../../../middlewares/validationMiddleware";
import { CourseLessonDITypes, courseLessonUrls } from "../lesson.type";
import { ICourseLessonController } from "../controller/lesson.controller";
import {
  CreateCourseLesson,
  UpdateCourseLesson,
} from "../controller/lesson.joi";

export default function CourseLessonRouter(
  authenticationMiddleware: any,
  authorizationMiddleware: any
) {
  const {
    userAuthorizationMiddleware,
    courseEnrollmentAuthorizationMiddleware,
    courseOwnershipAuthorizationMiddleware,
  } = authorizationMiddleware;

  const router = express.Router();

  const courseControllerInstance = dIContainer.get<ICourseLessonController>(
    CourseLessonDITypes.COURSE_LESSON_CONTROLLER
  );

  router.get(
    courseLessonUrls.lesson,
    courseControllerInstance.getLessonById.bind(courseControllerInstance)
  );

  router.post(
    "/",
    authenticationMiddleware,
    authorizationMiddleware(Role.INSTRUCTOR),
    courseEnrollmentAuthorizationMiddleware(Role.INSTRUCTOR),
    validationMiddleware(CreateCourseLesson, "body"),
    courseControllerInstance.createLesson.bind(courseControllerInstance)
  );

  router.put(
    courseLessonUrls.lesson,
    authenticationMiddleware,
    authorizationMiddleware(Role.INSTRUCTOR),
    courseEnrollmentAuthorizationMiddleware(Role.INSTRUCTOR),
    validationMiddleware(UpdateCourseLesson, "body"),
    courseControllerInstance.updateLesson.bind(courseControllerInstance)
  );

  router.delete(
    courseLessonUrls.lesson,
    authenticationMiddleware,
    authorizationMiddleware(Role.INSTRUCTOR),
    courseEnrollmentAuthorizationMiddleware(Role.INSTRUCTOR),
    courseControllerInstance.deleteLesson.bind(courseControllerInstance)
  );

  return router;
}
