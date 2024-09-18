"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCourseLessonAttachmentDtoJoi = exports.GetCourseLessonAttachmentsQueryJoi = exports.CreateCourseLessonAttachmentDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateCourseLessonAttachmentDtoJoi = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string(),
    file: joi_1.default.string().required(),
});
exports.GetCourseLessonAttachmentsQueryJoi = joi_1.default.object({
    pageNumber: joi_1.default.number(),
    pageSize: joi_1.default.number(),
});
exports.UpdateCourseLessonAttachmentDtoJoi = joi_1.default.object({
    name: joi_1.default.string(),
    description: joi_1.default.string(),
    file: joi_1.default.string(),
});
