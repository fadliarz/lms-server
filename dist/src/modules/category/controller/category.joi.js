"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCourseCategoryDtoJoi = exports.CreateCourseCategoryDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * CreateCourseCategory
 *
 */
exports.CreateCourseCategoryDtoJoi = joi_1.default.object({
    title: joi_1.default.string().required(),
});
/**
 * UpdateCourseCategory
 *
 */
exports.UpdateCourseCategoryDtoJoi = joi_1.default.object({
    title: joi_1.default.string(),
});
