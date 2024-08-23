"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ProductAPI = void 0;
var $ProductAPI;
(function ($ProductAPI) {
    const root = "/products";
    const product = "/:productId";
    let CreateProduct;
    (function (CreateProduct) {
        CreateProduct.endpoint = root;
        CreateProduct.generateUrl = () => CreateProduct.endpoint;
    })(CreateProduct = $ProductAPI.CreateProduct || ($ProductAPI.CreateProduct = {}));
})($ProductAPI || (exports.$ProductAPI = $ProductAPI = {}));
