"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateScholarshipDtoJoi = exports.CreateScholarshipDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateScholarshipDtoJoi = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string(),
    provider: joi_1.default.string().required(),
    deadline: joi_1.default.date().required(),
    reference: joi_1.default.string().required(),
});
exports.UpdateScholarshipDtoJoi = joi_1.default.object({
    title: joi_1.default.string(),
    description: joi_1.default.string(),
    provider: joi_1.default.string(),
    deadline: joi_1.default.date(),
    reference: joi_1.default.string(),
});
