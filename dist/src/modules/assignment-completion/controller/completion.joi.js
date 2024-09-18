"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCourseAssignmentCompletionDtoJoi = exports.CreateCourseAssignmentCompletionDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
const shared_types_1 = require("../../../common/shared.types");
exports.CreateCourseAssignmentCompletionDtoJoi = joi_1.default.object({
    userId: joi_1.default.number().required(),
    completionStatus: joi_1.default.valid(...Object.values(shared_types_1.AssignmentCompletionStatusModel)).required(),
});
exports.UpdateCourseAssignmentCompletionDtoJoi = joi_1.default.object({
    completionStatus: joi_1.default.valid(...Object.values(shared_types_1.AssignmentCompletionStatusModel)).required(),
});
