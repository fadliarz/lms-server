"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCourseLikeDtoJoi = exports.UpdateCourseCodeDtoJoi = exports.UpdateCourseCategoryIdDtoJoi = exports.UpdateCourseStatusDtoJoi = exports.UpdateCourseDtoJoi = exports.GetEnrolledCoursesQueryJoi = exports.GetCourseInstructorsQueryJoi = exports.GetCoursesQueryJoi = exports.GetCourseByIdQueryJoi = exports.CreateCourseInstructorDtoJoi = exports.CreateCourseDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
const course_type_1 = require("../course.type");
exports.CreateCourseDtoJoi = joi_1.default.object({
    code: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    categoryId: joi_1.default.number(),
    image: joi_1.default.string(),
    description: joi_1.default.string(),
});
exports.CreateCourseInstructorDtoJoi = joi_1.default.object({
    userId: joi_1.default.number().required(),
});
exports.GetCourseByIdQueryJoi = joi_1.default.object({
    include_category: joi_1.default.boolean(),
    include_lessons: joi_1.default.boolean(),
    include_public_videos: joi_1.default.boolean(),
});
exports.GetCoursesQueryJoi = joi_1.default.object({
    category_id: joi_1.default.array().items(joi_1.default.number()),
    include_category: joi_1.default.boolean(),
    pageSize: joi_1.default.number(),
    pageNumber: joi_1.default.number(),
});
exports.GetCourseInstructorsQueryJoi = joi_1.default.object({
    pageSize: joi_1.default.number(),
    pageNumber: joi_1.default.number(),
});
exports.GetEnrolledCoursesQueryJoi = joi_1.default.object({
    include_category: joi_1.default.boolean(),
    role: joi_1.default.array()
        .items(course_type_1.CourseEnrollmentRoleModel.STUDENT, course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR)
        .required(),
    limit_student_courses: joi_1.default.number(),
    limit_instructor_courses: joi_1.default.number(),
});
/**
 *
 */
exports.UpdateCourseDtoJoi = joi_1.default.object({
    description: joi_1.default.string(),
    image: joi_1.default.string(),
    title: joi_1.default.string(),
});
exports.UpdateCourseStatusDtoJoi = joi_1.default.object({
    status: joi_1.default.required().valid(course_type_1.CourseStatusModel.DRAFT, course_type_1.CourseStatusModel.PUBLISHED),
});
exports.UpdateCourseCategoryIdDtoJoi = joi_1.default.object({
    categoryId: joi_1.default.number().required(),
});
exports.UpdateCourseCodeDtoJoi = joi_1.default.object({
    code: joi_1.default.string().required(),
});
exports.CreateCourseLikeDtoJoi = joi_1.default.object({});
