"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBasicCourseLessonDtoJoi = exports.GetCourseLessonsQueryDtoJoi = exports.CreateCourseLessonDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateCourseLessonDtoJoi = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string(),
    references: joi_1.default.array().items(joi_1.default.string()),
});
exports.GetCourseLessonsQueryDtoJoi = joi_1.default.object({
    pageNumber: joi_1.default.number(),
    pageSize: joi_1.default.number(),
});
exports.UpdateBasicCourseLessonDtoJoi = joi_1.default.object({
    title: joi_1.default.string(),
    description: joi_1.default.string(),
    references: joi_1.default.array().items(joi_1.default.string()),
});
