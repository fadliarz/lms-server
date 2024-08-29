import express from "express";
import dIContainer from "../../../inversifyConfig";
import { IProductController } from "../product.interface";
import { ProductDITypes } from "../product.type";
import { $ProductAPI } from "../product.api";

export default function ProductRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<IProductController>(
    ProductDITypes.CONTROLLER,
  );

  /**
   * Create
   *
   */

  router.post(
    $ProductAPI.CreateProduct.endpoint,
    authenticationMiddleware,
    controller.createProduct.bind(controller),
  );

  /**
   * Get
   *
   */

  router.get(
    $ProductAPI.GetProducts.endpoint,
    authenticationMiddleware,
    controller.getProducts.bind(controller),
  );

  router.get(
    $ProductAPI.GetProductById.endpoint,
    authenticationMiddleware,
    controller.getProductById.bind(controller),
  );

  /**
   * Update
   *
   */

  router.patch(
    $ProductAPI.UpdateProduct.endpoint,
    authenticationMiddleware,
    controller.updateProduct.bind(controller),
  );

  /**
   * Delete
   *
   */

  router.delete(
    $ProductAPI.DeleteProduct.endpoint,
    authenticationMiddleware,
    controller.deleteProduct.bind(controller),
  );

  return router;
}
