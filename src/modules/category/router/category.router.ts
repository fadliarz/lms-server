import express from "express";
import dIContainer from "../../../inversifyConfig";
import { ICourseCategoryController } from "../controller/category.controller";
import { CourseCategoryDITypes, courseCategoryUrls } from "../category.type";

export default function CourseCategoryRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<ICourseCategoryController>(
    CourseCategoryDITypes.CONTROLLER,
  );

  /**
   * Create (CourseCategory)
   *
   */
  router.post(
    "/",
    authenticationMiddleware,
    controller.createCategory.bind(controller),
  );

  /**
   * Get (CourseCategory)
   *
   */
  router.get(
    courseCategoryUrls.category,
    controller.getCategories.bind(controller),
  );

  return router;
}
