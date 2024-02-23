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
    /**
     * GetCourseById
     *
     */
    router.get(course_type_2.courseUrls.course, controller.getCourseById.bind(controller));
    /**
     * GetCourses
     *
     */
    router.get("/", controller.getCourses.bind(controller));
    /**
     * GetEnrolledCourses
     *
     */
    router.get(course_type_2.courseUrls.enrolled, authenticationMiddleware, controller.getEnrolledCourses.bind(controller));
    /**
     * Update (Course)
     *
     */
    router.put(course_type_2.courseUrls.course, authenticationMiddleware, controller.updateBasicCourse.bind(controller));
    /**
     * Delete (Course)
     *
     */
    router.delete(course_type_2.courseUrls.course, authenticationMiddleware, controller.deleteCourse.bind(controller));
    /**
     * Create (CourseLike)
     *
     */
    router.post(course_type_2.courseUrls.likes, authenticationMiddleware, controller.createLike.bind(controller));
    /**
     * Delete (CourseLike)
     *
     */
    router.delete(course_type_2.courseUrls.like, authenticationMiddleware, controller.deleteLike.bind(controller));
    return router;
}
exports.default = CourseRouter;
