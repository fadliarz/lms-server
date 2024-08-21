"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const lesson_type_1 = require("../lesson.type");
function CourseLessonRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(lesson_type_1.CourseLessonDITypes.CONTROLLER);
    /**
     * Create
     *
     */
    router.post(lesson_type_1.$CourseLessonAPI.CreateLesson.endpoint, authenticationMiddleware, controller.createLesson.bind(controller));
    /**
     * Get
     *
     */
    router.get(lesson_type_1.$CourseLessonAPI.GetLessons.endpoint, controller.getLessons.bind(controller));
    router.get(lesson_type_1.$CourseLessonAPI.GetLessonById.endpoint, controller.getLessonById.bind(controller));
    /**
     * Update
     *
     */
    router.patch(lesson_type_1.$CourseLessonAPI.UpdateLesson.endpoint, authenticationMiddleware, controller.updateLesson.bind(controller));
    /**
     * Delete
     *
     */
    router.delete(lesson_type_1.$CourseLessonAPI.DeleteLesson.endpoint, authenticationMiddleware, controller.deleteLesson.bind(controller));
    return router;
}
exports.default = CourseLessonRouter;
