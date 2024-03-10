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
    router.post("/", authenticationMiddleware, controller.createLesson.bind(controller));
    router.get(lesson_type_1.courseLessonUrls.lesson, controller.getLessonById.bind(controller));
    router.put(lesson_type_1.courseLessonUrls.lesson, authenticationMiddleware, controller.updateLesson.bind(controller));
    router.delete(lesson_type_1.courseLessonUrls.lesson, authenticationMiddleware, controller.deleteLesson.bind(controller));
    return router;
}
exports.default = CourseLessonRouter;
