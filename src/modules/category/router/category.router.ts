import express from "express";
import dIContainer from "../../../inversifyConfig";
import { ICourseCategoryController } from "../controller/category.controller";
import { CourseCategoryDITypes, courseCategoryUrls } from "../category.type";
import { CourseCategoryAuthorizationMiddleware } from "../authorization/category.authorization";

export default function CourseCategoryRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<ICourseCategoryController>(
    CourseCategoryDITypes.CONTROLLER
  );
  const authorizationMiddleware = new CourseCategoryAuthorizationMiddleware();

  /**
   * Create (CourseCategory)
   *
   */
  router.post(
    "/",
    authenticationMiddleware,
    authorizationMiddleware.getCreateCategoryAuthorizationMiddleware(),
    controller.createCategory.bind(controller)
  );

  /**
   * Get (CourseCategory)
   * 
   */
  router.get(
    courseCategoryUrls.category,
    controller.getCategories.bind(controller)
  );

  return router;
}
