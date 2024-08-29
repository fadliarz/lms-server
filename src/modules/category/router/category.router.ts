import express from "express";
import dIContainer from "../../../inversifyConfig";
import { CourseCategoryDITypes } from "../category.type";
import { $CourseCategoryAPI } from "../category.api";
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
    $CourseCategoryAPI.CreateCategory.endpoint,
    authenticationMiddleware,
    controller.createCategory.bind(controller),
  );

  /**
   * Get
   *
   */

  router.get(
    $CourseCategoryAPI.GetCategories.endpoint,
    controller.getCategories.bind(controller),
  );

  router.get(
    $CourseCategoryAPI.GetCategoryById.endpoint,
    controller.getCategoryById.bind(controller),
  );

  /**
   * Update
   *
   */

  router.patch(
    $CourseCategoryAPI.UpdateCategory.endpoint,
    authenticationMiddleware,
    controller.updateCategory.bind(controller),
  );

  /**
   * Delete
   *
   */

  router.delete(
    $CourseCategoryAPI.DeleteCategory.endpoint,
    authenticationMiddleware,
    controller.deleteCategory.bind(controller),
  );

  return router;
}
