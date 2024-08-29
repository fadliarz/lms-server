"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ProductAPI = void 0;
var $ProductAPI;
(function ($ProductAPI) {
    const root = "/products";
    const product = root + "/:productId";
    let CreateProduct;
    (function (CreateProduct) {
        CreateProduct.endpoint = root;
        CreateProduct.generateUrl = () => CreateProduct.endpoint;
    })(CreateProduct = $ProductAPI.CreateProduct || ($ProductAPI.CreateProduct = {}));
    let GetProducts;
    (function (GetProducts) {
        GetProducts.endpoint = root;
        GetProducts.generateUrl = () => GetProducts.endpoint;
    })(GetProducts = $ProductAPI.GetProducts || ($ProductAPI.GetProducts = {}));
    let GetProductById;
    (function (GetProductById) {
        GetProductById.endpoint = product;
        GetProductById.generateUrl = (productId) => `/products/${productId}`;
    })(GetProductById = $ProductAPI.GetProductById || ($ProductAPI.GetProductById = {}));
    let UpdateProduct;
    (function (UpdateProduct) {
        UpdateProduct.endpoint = product;
        UpdateProduct.generateUrl = (productId) => `/products/${productId}`;
    })(UpdateProduct = $ProductAPI.UpdateProduct || ($ProductAPI.UpdateProduct = {}));
    let DeleteProduct;
    (function (DeleteProduct) {
        DeleteProduct.endpoint = product;
        DeleteProduct.generateUrl = (productId) => `/products/${productId}`;
    })(DeleteProduct = $ProductAPI.DeleteProduct || ($ProductAPI.DeleteProduct = {}));
})($ProductAPI || (exports.$ProductAPI = $ProductAPI = {}));
