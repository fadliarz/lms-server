import express from "express";
import dIContainer from "../../../inversifyConfig";
import { IOrderController } from "../order.interface";
import { OrderDITypes } from "../order.type";
import { $OrderAPI } from "../order.api";

export default function OrderRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<IOrderController>(OrderDITypes.CONTROLLER);

  /**
   * Create
   *
   */

  router.post(
    $OrderAPI.CreateOrder.endpoint,
    authenticationMiddleware,
    controller.createOrder.bind(controller),
  );

  /**
   * Get
   *
   */

  router.get(
    $OrderAPI.GetOrders.endpoint,
    authenticationMiddleware,
    controller.getOrders.bind(controller),
  );

  router.get(
    $OrderAPI.GetOrderById.endpoint,
    authenticationMiddleware,
    controller.getOrderById.bind(controller),
  );

  /**
   * Update
   *
   */

  router.patch(
    $OrderAPI.UpdateOrderArrivedStatus.endpoint,
    authenticationMiddleware,
    controller.updateOrderArrivedStatus.bind(controller),
  );

  router.patch(
    $OrderAPI.UpdateOrderReceipt.endpoint,
    authenticationMiddleware,
    controller.updateOrderReceipt.bind(controller),
  );

  router.patch(
    $OrderAPI.UpdateOrderRating.endpoint,
    authenticationMiddleware,
    controller.updateOrderRating.bind(controller),
  );

  /**
   * Delete
   *
   */

  router.delete(
    $OrderAPI.DeleteOrder.endpoint,
    authenticationMiddleware,
    controller.deleteOrder.bind(controller),
  );

  return router;
}
