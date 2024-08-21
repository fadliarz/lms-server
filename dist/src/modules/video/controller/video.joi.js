"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCourseLessonVideoSourceDtoJoi = exports.UpdateCourseLessonVideoDtoJoi = exports.CreateCourseLessonVideoDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateCourseLessonVideoDtoJoi = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string(),
    totalDurations: joi_1.default.number().required(),
    youtubeLink: joi_1.default.string().required(),
});
exports.UpdateCourseLessonVideoDtoJoi = joi_1.default.object({
    name: joi_1.default.string(),
    description: joi_1.default.string(),
});
exports.UpdateCourseLessonVideoSourceDtoJoi = joi_1.default.object({
    youtubeLink: joi_1.default.string().required(),
    totalDurations: joi_1.default.number().required(),
});
