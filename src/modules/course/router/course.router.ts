import express from "express";
import dIContainer from "../../../inversifyConfig";
import { CourseDITypes } from "../course.type";
import { courseUrls } from "../course.type";
import { Role } from "@prisma/client";
import { ICourseController } from "../controller/course.controller";
import { CreateCourse, UpdateCourse } from "../controller/course.joi";
import { validationMiddleware } from "../../../middlewares/validationMiddleware";

export default function CourseRouter(authorizationMiddleware: any) {
  const router = express.Router();

  const courseControllerInstance = dIContainer.get<ICourseController>(
    CourseDITypes.COURSE_CONTROLLER
  );

  router.post(
    courseUrls.create,
    validationMiddleware(CreateCourse),
    authorizationMiddleware([Role.INSTRUCTOR]),
    courseControllerInstance.createCourse.bind(courseControllerInstance)
  );

  router.put(
    courseUrls.update,
    validationMiddleware(UpdateCourse),
    courseControllerInstance.updateCourse.bind(courseControllerInstance)
  );

  return router;
}
