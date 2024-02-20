"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCourseEnrollmentRoleDtoJoi = exports.CreateCourseEnrollmentDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
const course_type_1 = require("../../course/course.type");
exports.CreateCourseEnrollmentDtoJoi = joi_1.default.object({
    userId: joi_1.default.number().required(),
    role: joi_1.default.string()
        .required()
        .valid(...[
        course_type_1.CourseEnrollmentRoleModel.STUDENT,
        course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
    ].map((enrollmentRole) => enrollmentRole.toString())),
});
exports.UpdateCourseEnrollmentRoleDtoJoi = joi_1.default.object({
    role: joi_1.default.string()
        .required()
        .valid(...[
        course_type_1.CourseEnrollmentRoleModel.STUDENT,
        course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
    ].map((enrollmentRole) => enrollmentRole.toString())),
});
