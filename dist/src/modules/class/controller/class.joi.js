"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCourseClassDtoJoi = exports.CreateCourseClassDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Create
 *
 */
exports.CreateCourseClassDtoJoi = joi_1.default.object({
    title: joi_1.default.string().required(),
});
/**
 * Update
 *
 */
exports.UpdateCourseClassDtoJoi = joi_1.default.object({
    title: joi_1.default.string(),
});
