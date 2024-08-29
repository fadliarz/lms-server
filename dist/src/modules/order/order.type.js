"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderErrorMessage = exports.OrderDITypes = void 0;
exports.OrderDITypes = {
    REPOSITORY: Symbol.for("ORDER_REPOSITORY"),
    SERVICE: Symbol.for("ORDER_SERVICE"),
    CONTROLLER: Symbol.for("ORDER_CONTROLLER"),
    AUTHORIZATION: Symbol.for("ORDER_AUTHORIZATION"),
};
exports.OrderErrorMessage = {
    OUT_OF_STOCK: "out of stock!",
};
