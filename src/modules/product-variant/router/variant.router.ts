import express from "express";
import dIContainer from "../../../inversifyConfig";
import { IProductVariantController } from "../variant.interface";
import { ProductVariantDITypes } from "../variant.type";
import { $ProductVariantAPI } from "../variant.api";
import { $ProductAPI } from "../../product/product.api";

export default function ProductVariantRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<IProductVariantController>(
    ProductVariantDITypes.CONTROLLER,
  );

  /**
   * Create
   *
   */

  router.post(
    $ProductVariantAPI.CreateVariant.endpoint,
    authenticationMiddleware,
    controller.createVariant.bind(controller),
  );

  /**
   * Get
   *
   */

  router.get(
    $ProductVariantAPI.GetVariants.endpoint,
    authenticationMiddleware,
    controller.getVariants.bind(controller),
  );

  router.get(
    $ProductVariantAPI.GetVariantById.endpoint,
    authenticationMiddleware,
    controller.getVariantById.bind(controller),
  );

  /**
   * Update
   *
   */

  router.patch(
    $ProductVariantAPI.UpdateVariant.endpoint,
    authenticationMiddleware,
    controller.updateVariant.bind(controller),
  );

  /**
   * Delete
   *
   */

  router.delete(
    $ProductAPI.DeleteProduct.endpoint,
    authenticationMiddleware,
    controller.deleteVariant.bind(controller),
  );

  return router;
}
