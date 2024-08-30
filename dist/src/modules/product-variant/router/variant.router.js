"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const variant_type_1 = require("../variant.type");
const variant_api_1 = require("../variant.api");
const product_api_1 = require("../../product/product.api");
function ProductVariantRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(variant_type_1.ProductVariantDITypes.CONTROLLER);
    /**
     * Create
     *
     */
    router.post(variant_api_1.$ProductVariantAPI.CreateVariant.endpoint, authenticationMiddleware, controller.createVariant.bind(controller));
    /**
     * Get
     *
     */
    router.get(variant_api_1.$ProductVariantAPI.GetVariants.endpoint, authenticationMiddleware, controller.getVariants.bind(controller));
    router.get(variant_api_1.$ProductVariantAPI.GetVariantById.endpoint, authenticationMiddleware, controller.getVariantById.bind(controller));
    /**
     * Update
     *
     */
    router.patch(variant_api_1.$ProductVariantAPI.UpdateVariant.endpoint, authenticationMiddleware, controller.updateVariant.bind(controller));
    router.patch(variant_api_1.$ProductVariantAPI.UpdateVariantStockWithIncrement.endpoint, authenticationMiddleware, controller.updateVariantStockWithIncrement.bind(controller));
    /**
     * Delete
     *
     */
    router.delete(product_api_1.$ProductAPI.DeleteProduct.endpoint, authenticationMiddleware, controller.deleteVariant.bind(controller));
    return router;
}
exports.default = ProductVariantRouter;
