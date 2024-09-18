"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCourseClassAssignmentDtoJoi = exports.GetCourseClassAssignmentsQueryJoi = exports.CreateCourseClassAssignmentDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
const shared_types_1 = require("../../../common/shared.types");
exports.CreateCourseClassAssignmentDtoJoi = joi_1.default.object({
    title: joi_1.default.string().required(),
    submission: joi_1.default.string().required(),
    deadline: joi_1.default.date().required(),
    description: joi_1.default.string(),
    taskType: joi_1.default.valid(...Object.values(shared_types_1.AssignmentTaskTypeModel)).required(),
});
exports.GetCourseClassAssignmentsQueryJoi = joi_1.default.object({
    pageSize: joi_1.default.number(),
    pageNumber: joi_1.default.number(),
});
exports.UpdateCourseClassAssignmentDtoJoi = joi_1.default.object({
    title: joi_1.default.string(),
    submission: joi_1.default.string(),
    deadline: joi_1.default.date(),
    description: joi_1.default.string(),
    taskType: joi_1.default.valid(...Object.values(shared_types_1.AssignmentTaskTypeModel)),
});
