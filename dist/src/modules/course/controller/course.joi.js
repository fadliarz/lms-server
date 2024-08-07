"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCourseLikeDtoJoi = exports.UpdateCourseCodeDtoJoi = exports.UpdateCourseCategoryIdDtoJoi = exports.UpdateCourseStatusDtoJoi = exports.UpdateBasicCourseDtoJoi = exports.GetEnrolledCoursesQueryJoi = exports.GetCoursesQueryJoi = exports.GetCourseByIdQueryJoi = exports.CreateCourseDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
const course_type_1 = require("../course.type");
/**
 * CreateCourse
 *
 */
exports.CreateCourseDtoJoi = joi_1.default.object({
    code: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    categoryId: joi_1.default.number().required(),
    image: joi_1.default.string(),
    description: joi_1.default.string(),
    material: joi_1.default.string(),
});
/**
 * GetCourseById
 *
 */
exports.GetCourseByIdQueryJoi = joi_1.default.object({
    /**
     * Include
     */
    include_author: joi_1.default.boolean(),
    include_category: joi_1.default.boolean(),
    include_lessons: joi_1.default.boolean(),
    include_public_videos: joi_1.default.boolean(),
});
/**
 * GetCourses
 *
 */
exports.GetCoursesQueryJoi = joi_1.default.object({
    /**
     * Include
     */
    include_author: joi_1.default.boolean(),
    include_category: joi_1.default.boolean(),
    /**
     * Limit
     */
    pageSize: joi_1.default.number().required().min(1).max(10),
    pageNumber: joi_1.default.number().required().min(1),
});
/**
 * GetEnrolledCourses
 *
 */
exports.GetEnrolledCoursesQueryJoi = joi_1.default.object({
    /**
     * Include
     */
    include_author: joi_1.default.boolean(),
    include_category: joi_1.default.boolean(),
    role: joi_1.default.array()
        .items(course_type_1.CourseEnrollmentRoleModel.STUDENT, course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR)
        .required(),
    /**
     * Limit
     */
    limit_student_courses: joi_1.default.number(),
    limit_instructor_courses: joi_1.default.number(),
});
/**
 * UpdateCourse
 */
exports.UpdateBasicCourseDtoJoi = joi_1.default.object({
    description: joi_1.default.string(),
    image: joi_1.default.string(),
    title: joi_1.default.string(),
    material: joi_1.default.string(),
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
/**
 * CreateCourseLike
 *
 */
exports.CreateCourseLikeDtoJoi = joi_1.default.object({});
