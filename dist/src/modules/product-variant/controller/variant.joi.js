"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVariantStockWithIncrementDtoJoi = exports.UpdateProductVariantDtoJoi = exports.CreateProductVariantDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateProductVariantDtoJoi = joi_1.default.object({
    title: joi_1.default.string().required(),
    price: joi_1.default.number().required(),
});
exports.UpdateProductVariantDtoJoi = joi_1.default.object({
    title: joi_1.default.string(),
    price: joi_1.default.number(),
});
exports.UpdateVariantStockWithIncrementDtoJoi = joi_1.default.object({
    increment: joi_1.default.number().required(),
});
