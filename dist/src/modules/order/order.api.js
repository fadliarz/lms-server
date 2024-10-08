"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$OrderAPI = void 0;
var $OrderAPI;
(function ($OrderAPI) {
    const root = "/products/:productId/variants/:variantId/orders";
    const order = root + "/:orderId";
    function transformObject(order) {
        if (Array.isArray(order)) {
            return order;
        }
        return order;
    }
    $OrderAPI.transformObject = transformObject;
    let CreateOrder;
    (function (CreateOrder) {
        CreateOrder.endpoint = root;
        CreateOrder.generateUrl = (productId, variantId) => `/products/${productId}/variants/${variantId}/orders`;
    })(CreateOrder = $OrderAPI.CreateOrder || ($OrderAPI.CreateOrder = {}));
    let GetOrders;
    (function (GetOrders) {
        GetOrders.endpoint = root;
        GetOrders.generateUrl = (productId, variantId) => `/products/${productId}/variants/${variantId}/orders`;
    })(GetOrders = $OrderAPI.GetOrders || ($OrderAPI.GetOrders = {}));
    let GetOrderById;
    (function (GetOrderById) {
        GetOrderById.endpoint = order;
        GetOrderById.generateUrl = (productId, variantId, orderId) => `/products/${productId}/variants/${variantId}/orders/${orderId}}`;
    })(GetOrderById = $OrderAPI.GetOrderById || ($OrderAPI.GetOrderById = {}));
    let UpdateOrderArrivedStatus;
    (function (UpdateOrderArrivedStatus) {
        const attribute = "arrived-status";
        UpdateOrderArrivedStatus.endpoint = `${order}/${attribute}`;
        UpdateOrderArrivedStatus.generateUrl = (productId, variantId, orderId) => `/products/${productId}/variants/${variantId}/orders/${orderId}/${attribute}`;
    })(UpdateOrderArrivedStatus = $OrderAPI.UpdateOrderArrivedStatus || ($OrderAPI.UpdateOrderArrivedStatus = {}));
    let UpdateOrderReceipt;
    (function (UpdateOrderReceipt) {
        const attribute = "receipt";
        UpdateOrderReceipt.endpoint = `${order}/${attribute}`;
        UpdateOrderReceipt.generateUrl = (productId, variantId, orderId) => `/products/${productId}/variants/${variantId}/orders/${orderId}/${attribute}`;
    })(UpdateOrderReceipt = $OrderAPI.UpdateOrderReceipt || ($OrderAPI.UpdateOrderReceipt = {}));
    let UpdateOrderRating;
    (function (UpdateOrderRating) {
        const attribute = "rating";
        UpdateOrderRating.endpoint = `${order}/${attribute}`;
        UpdateOrderRating.generateUrl = (productId, variantId, orderId) => `/products/${productId}/variants/${variantId}/orders/${orderId}/${attribute}`;
    })(UpdateOrderRating = $OrderAPI.UpdateOrderRating || ($OrderAPI.UpdateOrderRating = {}));
    let DeleteOrder;
    (function (DeleteOrder) {
        DeleteOrder.endpoint = order;
        DeleteOrder.generateUrl = (productId, variantId, orderId) => `/products/${productId}/variants/${variantId}/orders/${orderId}}`;
    })(DeleteOrder = $OrderAPI.DeleteOrder || ($OrderAPI.DeleteOrder = {}));
})($OrderAPI || (exports.$OrderAPI = $OrderAPI = {}));
