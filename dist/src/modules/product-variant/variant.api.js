"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ProductVariantAPI = void 0;
var $ProductVariantAPI;
(function ($ProductVariantAPI) {
    const root = "/products/:productId/variants";
    const variant = root + "/:variantId";
    let CreateVariant;
    (function (CreateVariant) {
        CreateVariant.endpoint = root;
        CreateVariant.generateUrl = (productId) => `/products/${productId}/variants`;
    })(CreateVariant = $ProductVariantAPI.CreateVariant || ($ProductVariantAPI.CreateVariant = {}));
    let GetVariants;
    (function (GetVariants) {
        GetVariants.endpoint = root;
        GetVariants.generateUrl = (productId) => `/products/${productId}/variants`;
    })(GetVariants = $ProductVariantAPI.GetVariants || ($ProductVariantAPI.GetVariants = {}));
    let GetVariantById;
    (function (GetVariantById) {
        GetVariantById.endpoint = variant;
        GetVariantById.generateUrl = (productId, variantId) => `/products/${productId}/variants/${variantId}`;
    })(GetVariantById = $ProductVariantAPI.GetVariantById || ($ProductVariantAPI.GetVariantById = {}));
    let UpdateVariant;
    (function (UpdateVariant) {
        UpdateVariant.endpoint = variant;
        UpdateVariant.generateUrl = (productId, variantId) => `/products/${productId}/variants/${variantId}`;
    })(UpdateVariant = $ProductVariantAPI.UpdateVariant || ($ProductVariantAPI.UpdateVariant = {}));
    let UpdateVariantStockWithIncrement;
    (function (UpdateVariantStockWithIncrement) {
        const attribute = "stock-increment";
        UpdateVariantStockWithIncrement.endpoint = `${variant}/${attribute}`;
        UpdateVariantStockWithIncrement.generateUrl = (productId, variantId) => `/products/${productId}/variants/${variantId}/${attribute}`;
    })(UpdateVariantStockWithIncrement = $ProductVariantAPI.UpdateVariantStockWithIncrement || ($ProductVariantAPI.UpdateVariantStockWithIncrement = {}));
    let DeleteVariant;
    (function (DeleteVariant) {
        DeleteVariant.endpoint = variant;
        DeleteVariant.generateUrl = (productId, variantId) => `/products/${productId}/variants/${variantId}`;
    })(DeleteVariant = $ProductVariantAPI.DeleteVariant || ($ProductVariantAPI.DeleteVariant = {}));
})($ProductVariantAPI || (exports.$ProductVariantAPI = $ProductVariantAPI = {}));
