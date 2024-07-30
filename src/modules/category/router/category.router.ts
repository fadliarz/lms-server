import express from "express";
import dIContainer from "../../../inversifyConfig";
import { CourseCategoryDITypes, courseCategoryUrls } from "../category.type";
import { ICourseCategoryController } from "../category.interface";

export default function CourseCategoryRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<ICourseCategoryController>(
    CourseCategoryDITypes.CONTROLLER,
  );

  /**
   * Create
   *
   */
  router.post(
    "/",
    authenticationMiddleware,
    controller.createCategory.bind(controller),
  );

  /**
   * Get
   *
   */
  router.get("/", controller.getCategories.bind(controller));

  router.get(
    courseCategoryUrls.category,
    controller.getCategoryById.bind(controller),
  );

  /**
   * Update
   *
   */
  router.patch(
    courseCategoryUrls.basic,
    authenticationMiddleware,
    controller.updateBasicCategory.bind(controller),
  );

  return router;
}
