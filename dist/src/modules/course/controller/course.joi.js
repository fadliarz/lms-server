"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCourseLikeDtoJoi = exports.UpdateCourseDtoJoi = exports.GetEnrolledCoursesQueryJoi = exports.GetCoursesQueryJoi = exports.GetCourseByIdQueryJoi = exports.CreateCourseDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
const client_1 = require("@prisma/client");
/**
 * CreateCourse
 *
 */
exports.CreateCourseDtoJoi = joi_1.default.object({
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
    // role: "addSoon",
    /**
     * Limit
     */
    limit_student_courses: joi_1.default.number(),
    limit_instructor_courses: joi_1.default.number(),
});
/**
 * UpdateCourse
 */
exports.UpdateCourseDtoJoi = joi_1.default.object({
    title: joi_1.default.string(),
    categoryId: joi_1.default.number(),
    image: joi_1.default.string(),
    description: joi_1.default.string(),
    material: joi_1.default.string(),
    status: joi_1.default.string().valid(client_1.CourseStatus.PUBLISHED, client_1.CourseStatus.DRAFT),
});
/**
 * CreateCourseLike
 *
 */
exports.CreateCourseLikeDtoJoi = joi_1.default.object({});
