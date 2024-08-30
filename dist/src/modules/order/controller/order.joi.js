"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrderRatingDtoJoi = exports.UpdateOrderReceiptDtoJoi = exports.UpdateOrderArrivedStatusDtoJoi = exports.CreateOrderDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateOrderDtoJoi = joi_1.default.object({
    userId: joi_1.default.number().required(),
    description: joi_1.default.string(),
});
exports.UpdateOrderArrivedStatusDtoJoi = joi_1.default.object({
    isArrived: joi_1.default.boolean().required(),
});
exports.UpdateOrderReceiptDtoJoi = joi_1.default.object({
    receipt: joi_1.default.string().allow(null).required(),
});
exports.UpdateOrderRatingDtoJoi = joi_1.default.object({
    receipt: joi_1.default.number().integer().min(1).max(5).allow(null).required(),
});
