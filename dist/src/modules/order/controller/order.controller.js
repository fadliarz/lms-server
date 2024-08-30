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
const order_type_1 = require("../order.type");
const validateJoi_1 = __importDefault(require("../../../common/functions/validateJoi"));
const getRequestUserOrThrowAuthenticationException_1 = __importDefault(require("../../../common/functions/getRequestUserOrThrowAuthenticationException"));
const statusCode_1 = require("../../../common/constants/statusCode");
const order_joi_1 = require("./order.joi");
const NaNException_1 = __importDefault(require("../../../common/class/exceptions/NaNException"));
let OrderController = class OrderController {
    createOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: order_joi_1.CreateOrderDtoJoi })(req, res, next);
                const newOrder = yield this.service.createOrder((0, getRequestUserOrThrowAuthenticationException_1.default)(req), this.validateResourceId(req, true), req.body);
                return res.status(statusCode_1.StatusCode.RESOURCE_CREATED).json({
                    data: newOrder,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield this.service.getOrders((0, getRequestUserOrThrowAuthenticationException_1.default)(req), this.validateResourceId(req, true));
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: orders,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getOrderById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.service.getOrderById((0, getRequestUserOrThrowAuthenticationException_1.default)(req), this.validateResourceId(req));
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: order,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateOrderArrivedStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: order_joi_1.UpdateOrderArrivedStatusDtoJoi })(req, res, next);
                const updatedOrder = yield this.service.updateOrderArrivedStatus((0, getRequestUserOrThrowAuthenticationException_1.default)(req), this.validateResourceId(req), req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: updatedOrder,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateOrderReceipt(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: order_joi_1.UpdateOrderReceiptDtoJoi })(req, res, next);
                const updatedOrder = yield this.service.updateOrderReceipt((0, getRequestUserOrThrowAuthenticationException_1.default)(req), this.validateResourceId(req), req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: updatedOrder,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateOrderRating(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: order_joi_1.UpdateOrderRatingDtoJoi })(req, res, next);
                const updatedOrder = yield this.service.updateOrderRating((0, getRequestUserOrThrowAuthenticationException_1.default)(req), this.validateResourceId(req), req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: updatedOrder,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.service.deleteOrder((0, getRequestUserOrThrowAuthenticationException_1.default)(req), this.validateResourceId(req));
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: {},
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    validateResourceId(req, exclude) {
        const productId = Number(req.params.productId);
        const variantId = Number(req.params.variantId);
        if (isNaN(productId)) {
            throw new NaNException_1.default("productId || variantId");
        }
        if (!!exclude) {
            return { variantId, resourceId: { productId } };
        }
        const orderId = Number(req.params.orderId);
        if (isNaN(orderId)) {
            throw new NaNException_1.default("orderId");
        }
        return {
            orderId,
            resourceId: {
                productId,
                variantId,
            },
        };
    }
};
__decorate([
    (0, inversify_1.inject)(order_type_1.OrderDITypes.SERVICE),
    __metadata("design:type", Object)
], OrderController.prototype, "service", void 0);
OrderController = __decorate([
    (0, inversify_1.injectable)()
], OrderController);
exports.default = OrderController;
