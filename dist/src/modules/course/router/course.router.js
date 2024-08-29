"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const course_type_1 = require("../course.type");
const course_api_1 = require("../course.api");
function CourseRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(course_type_1.CourseDITypes.CONTROLLER);
    /**
     * CreateCourse
     *
     */
    router.post(course_api_1.$CourseAPI.CreateCourse.endpoint, authenticationMiddleware, controller.createCourse.bind(controller));
    router.post(course_api_1.$CourseAPI.CreateLike.endpoint, authenticationMiddleware, controller.createLike.bind(controller));
    /**
     * Get
     *
     */
    router.get(course_api_1.$CourseAPI.GetCourses.endpoint, controller.getCourses.bind(controller));
    router.get(course_api_1.$CourseAPI.GetCourseById.endpoint, controller.getCourseById.bind(controller));
    /**
     * Update
     *
     */
    router.patch(course_api_1.$CourseAPI.UpdateCourse.endpoint, authenticationMiddleware, controller.updateCourse.bind(controller));
    router.patch(course_api_1.$CourseAPI.UpdateCourseStatus.endpoint, authenticationMiddleware, controller.updateCourseStatus.bind(controller));
    router.patch(course_api_1.$CourseAPI.UpdateCourseCategoryId.endpoint, authenticationMiddleware, controller.updateCourseCategoryId.bind(controller));
    router.patch(course_api_1.$CourseAPI.UpdateCourseCode.endpoint, authenticationMiddleware, controller.updateCourseCode.bind(controller));
    /**
     * Delete
     *
     */
    router.delete(course_api_1.$CourseAPI.DeleteCourse.endpoint, authenticationMiddleware, controller.deleteCourse.bind(controller));
    router.delete(course_api_1.$CourseAPI.DeleteLike.endpoint, authenticationMiddleware, controller.deleteLike.bind(controller));
    return router;
}
exports.default = CourseRouter;
