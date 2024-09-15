"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCourseClassDtoJoi = exports.GetCourseClassesQueryJoi = exports.CreateCourseClassDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateCourseClassDtoJoi = joi_1.default.object({
    title: joi_1.default.string().required(),
});
exports.GetCourseClassesQueryJoi = joi_1.default.object({
    pageSize: joi_1.default.number(),
    pageNumber: joi_1.default.number(),
});
exports.UpdateCourseClassDtoJoi = joi_1.default.object({
    title: joi_1.default.string(),
});
