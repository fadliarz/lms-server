"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const product_type_1 = require("../product.type");
const validateJoi_1 = __importDefault(require("../../../common/functions/validateJoi"));
const statusCode_1 = require("../../../common/constants/statusCode");
const getRequestUserOrThrowAuthenticationException_1 = __importDefault(require("../../../common/functions/getRequestUserOrThrowAuthenticationException"));
const product_joi_1 = require("./product.joi");
const NaNException_1 = __importDefault(require("../../../common/class/exceptions/NaNException"));
let ProductController = class ProductController {
    createProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: product_joi_1.CreateProductDtoJoi })(req, res, next);
                const newProduct = yield this.service.createProduct((0, getRequestUserOrThrowAuthenticationException_1.default)(req), req.body);
                return res.status(statusCode_1.StatusCode.RESOURCE_CREATED).json({
                    data: newProduct,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getProducts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield this.service.getProducts();
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: products,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getProductById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield this.service.getProductById({
                    productId: this.validateProductId(req),
                });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: product,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: product_joi_1.UpdateProductDtoJoi })(req, res, next);
                const updatedProduct = yield this.service.updateProduct((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { productId: this.validateProductId(req) }, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: updatedProduct,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.service.deleteProduct((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { productId: this.validateProductId(req) });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: {},
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    validateProductId(req) {
        const productId = Number(req.params.productId);
        if (isNaN(productId)) {
            throw new NaNException_1.default("productId");
        }
        return productId;
    }
};
__decorate([
    (0, inversify_1.inject)(product_type_1.ProductDITypes.SERVICE),
    __metadata("design:type", Object)
], ProductController.prototype, "service", void 0);
ProductController = __decorate([
    (0, inversify_1.injectable)()
], ProductController);
exports.default = ProductController;
