"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const product_type_1 = require("../product.type");
const product_api_1 = require("../product.api");
function ProductRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(product_type_1.ProductDITypes.CONTROLLER);
    /**
     * Create
     *
     */
    router.post(product_api_1.$ProductAPI.CreateProduct.endpoint, authenticationMiddleware, controller.createProduct.bind(controller));
    /**
     * Get
     *
     */
    router.get(product_api_1.$ProductAPI.GetProducts.endpoint, authenticationMiddleware, controller.getProducts.bind(controller));
    router.get(product_api_1.$ProductAPI.GetProductById.endpoint, authenticationMiddleware, controller.getProductById.bind(controller));
    /**
     * Update
     *
     */
    router.patch(product_api_1.$ProductAPI.UpdateProduct.endpoint, authenticationMiddleware, controller.updateProduct.bind(controller));
    /**
     * Delete
     *
     */
    router.delete(product_api_1.$ProductAPI.DeleteProduct.endpoint, authenticationMiddleware, controller.deleteProduct.bind(controller));
    return router;
}
exports.default = ProductRouter;
