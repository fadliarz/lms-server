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
} from "../controller/course.joi";
import { validationMiddleware } from "../../../middlewares/validationMiddleware";

export default function CourseRouter(
  authenticationMiddleware: any,
  authorizationMiddleware: any
) {
  const {
    userAuthorizationMiddleware,
    courseEnrollmentAuthorizationMiddleware,
    courseOwnershipAuthorizationMiddleware,
  } = authorizationMiddleware;

  const router = express.Router();

  const courseControllerInstance = dIContainer.get<ICourseController>(
    CourseDITypes.COURSE_CONTROLLER
  );

  router.get(
    courseUrls.student,
    authenticationMiddleware,
    courseControllerInstance.getStudentCourses.bind(courseControllerInstance)
  );

  router.get(
    courseUrls.instructor,
    authenticationMiddleware,
    userAuthorizationMiddleware(Role.INSTRUCTOR),
    courseControllerInstance.getInstructorCourses.bind(courseControllerInstance)
  );

  router.get(
    courseUrls.student.concat(courseUrls.course),
    authenticationMiddleware,
    courseEnrollmentAuthorizationMiddleware(Role.STUDENT),
    validationMiddleware(GetCourseQueryJoi, "query"),
    courseControllerInstance.getStudentCourseById.bind(courseControllerInstance)
  );

  router.get(
    courseUrls.instructor.concat(courseUrls.course),
    authenticationMiddleware,
    userAuthorizationMiddleware(Role.INSTRUCTOR),
    courseEnrollmentAuthorizationMiddleware(Role.INSTRUCTOR),
    validationMiddleware(GetCourseQueryJoi, "query"),
    courseControllerInstance.getInstructorCourseById.bind(
      courseControllerInstance
    )
  );

  router.post(
    "/",
    authenticationMiddleware,
    userAuthorizationMiddleware(Role.INSTRUCTOR),
    validationMiddleware(CreateCourse, "body"),
    courseControllerInstance.createCourse.bind(courseControllerInstance)
  );

  router.put(
    courseUrls.course,
    authenticationMiddleware,
    userAuthorizationMiddleware(Role.INSTRUCTOR),
    courseEnrollmentAuthorizationMiddleware(Role.INSTRUCTOR),
    validationMiddleware(UpdateCourse, "body"),
    courseControllerInstance.updateCourse.bind(courseControllerInstance)
  );

  router.put(
    courseUrls.likes,
    authenticationMiddleware,
    courseEnrollmentAuthorizationMiddleware([Role.STUDENT]),
    courseControllerInstance.setLike.bind(courseControllerInstance)
  );

  router.delete(
    courseUrls.course,
    authenticationMiddleware,
    userAuthorizationMiddleware(Role.INSTRUCTOR),
    courseOwnershipAuthorizationMiddleware(),
    courseControllerInstance.deleteCourse.bind(courseControllerInstance)
  );

  return router;
}
