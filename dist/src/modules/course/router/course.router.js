"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const course_type_1 = require("../course.type");
const course_type_2 = require("../course.type");
function CourseRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(course_type_1.CourseDITypes.CONTROLLER);
    /**
     * CreateCourse
     *
     */
    router.post("/", authenticationMiddleware, controller.createCourse.bind(controller));
    router.post(course_type_2.courseUrls.likes, authenticationMiddleware, controller.createLike.bind(controller));
    /**
     * Get
     *
     */
    router.get(course_type_2.courseUrls.course, controller.getCourseById.bind(controller));
    router.get("/", controller.getCourses.bind(controller));
    router.get(course_type_2.courseUrls.enrolled, authenticationMiddleware, controller.getEnrolledCourses.bind(controller));
    /**
     * Update
     *
     */
    router.patch(course_type_2.courseUrls.basic, authenticationMiddleware, controller.updateBasicCourse.bind(controller));
    router.patch(course_type_2.courseUrls.status, authenticationMiddleware, controller.updateCourseStatus.bind(controller));
    router.patch(course_type_2.courseUrls.category, authenticationMiddleware, controller.updateCourseCategoryId.bind(controller));
    /**
     * Delete
     *
     */
    router.delete(course_type_2.courseUrls.course, authenticationMiddleware, controller.deleteCourse.bind(controller));
    router.delete(course_type_2.courseUrls.like, authenticationMiddleware, controller.deleteLike.bind(controller));
    return router;
}
exports.default = CourseRouter;
