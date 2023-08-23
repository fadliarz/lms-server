import express from "express";
import dIContainer from "../../../inversifyConfig";
import { ICourseEnrollmentController } from "../controller/enrollment.controller";
import {
  CourseEnrollmentDITypes,
  courseEnrollmentUrls,
} from "../enrollment.type";
import { ICourseEnrollmentAuthorizationMiddleware } from "../authorization/enrollment.authorization";
import { validationMiddleware } from "../../../middlewares/validationMiddleware";
import {
  CreateCourseEnrollmentDtoJoi,
  UpdateCousreEnrollmentDtoJoi,
} from "../controller/enrollment.joi";

export default function CourseEnrollmentRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<ICourseEnrollmentController>(
    CourseEnrollmentDITypes.CONTROLLER
  );
  const authorizationMiddleware =
    dIContainer.get<ICourseEnrollmentAuthorizationMiddleware>(
      CourseEnrollmentDITypes.AUTHORIZATION_MIDDLEARE
    );

  router.post(
    "/",
    authenticationMiddleware,
    validationMiddleware({ body: CreateCourseEnrollmentDtoJoi }),
    authorizationMiddleware
      .getCreateCourseEnrollmentAuthorizationMiddleware()
      .bind(authorizationMiddleware),
    controller.create.bind(controller)
  );

  router.post(
    courseEnrollmentUrls.enrollment,
    authenticationMiddleware,
    validationMiddleware({ body: UpdateCousreEnrollmentDtoJoi }),
    authorizationMiddleware
      .getUpdateCourseEnrollmentAuthorizationMiddleWare()
      .bind(authorizationMiddleware),
    controller.update.bind(controller)
  );

  router.delete(
    courseEnrollmentUrls.enrollment,
    authenticationMiddleware,
    authorizationMiddleware
      .getDeleteCourseEnrollmentAuthorizationMiddleware()
      .bind(authorizationMiddleware),
    controller.delete.bind(controller)
  );

  return router;
}
