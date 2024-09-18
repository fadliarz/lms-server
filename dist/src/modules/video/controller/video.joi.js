"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCourseLessonVideoDtoJoi = exports.GetCourseLessonVideosQueryJoi = exports.CreateCourseLessonVideoDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateCourseLessonVideoDtoJoi = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string(),
    totalDurations: joi_1.default.number().required(),
    youtubeLink: joi_1.default.string().required(),
});
exports.GetCourseLessonVideosQueryJoi = joi_1.default.object({
    pageNumber: joi_1.default.number(),
    pageSize: joi_1.default.number(),
});
exports.UpdateCourseLessonVideoDtoJoi = joi_1.default.object({
    name: joi_1.default.string(),
    description: joi_1.default.string(),
    youtubeLink: joi_1.default.string(),
    totalDurations: joi_1.default.number(),
});
