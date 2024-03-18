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
