"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const order_type_1 = require("../order.type");
const order_api_1 = require("../order.api");
function OrderRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(order_type_1.OrderDITypes.CONTROLLER);
    /**
     * Create
     *
     */
    router.post(order_api_1.$OrderAPI.CreateOrder.endpoint, authenticationMiddleware, controller.createOrder.bind(controller));
    /**
     * Get
     *
     */
    router.get(order_api_1.$OrderAPI.GetOrders.endpoint, authenticationMiddleware, controller.getOrders.bind(controller));
    router.get(order_api_1.$OrderAPI.GetOrderById.endpoint, authenticationMiddleware, controller.getOrderById.bind(controller));
    /**
     * Update
     *
     */
    router.patch(order_api_1.$OrderAPI.UpdateOrderArrivedStatus.endpoint, authenticationMiddleware, controller.updateOrderArrivedStatus.bind(controller));
    router.patch(order_api_1.$OrderAPI.UpdateOrderReceipt.endpoint, authenticationMiddleware, controller.updateOrderReceipt.bind(controller));
    router.patch(order_api_1.$OrderAPI.UpdateOrderRating.endpoint, authenticationMiddleware, controller.updateOrderRating.bind(controller));
    /**
     * Delete
     *
     */
    router.delete(order_api_1.$OrderAPI.DeleteOrder.endpoint, authenticationMiddleware, controller.deleteOrder.bind(controller));
    return router;
}
exports.default = OrderRouter;
