"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductDITypes = void 0;
exports.ProductDITypes = {
    REPOSITORY: Symbol.for("PRODUCT_REPOSITORY"),
    SERVICE: Symbol.for("PRODUCT_SERVICE"),
    CONTROLLER: Symbol.for("PRODUCT_CONTROLLER"),
    AUTHORIZATION: Symbol.for("PRODUCT_AUTHORIZATION"),
};
