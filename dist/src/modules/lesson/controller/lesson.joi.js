"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCourseLessonDtoJoi = exports.CreateCourseLessonDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * CreateCourseLesson
 *
 */
exports.CreateCourseLessonDtoJoi = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string(),
});
/**
 * UpdateCourseLesson
 *
 */
exports.UpdateCourseLessonDtoJoi = joi_1.default.object({
    title: joi_1.default.string(),
    description: joi_1.default.string(),
});
