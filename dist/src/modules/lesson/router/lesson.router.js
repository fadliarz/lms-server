"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const lesson_type_1 = require("../lesson.type");
const validationMiddleware_1 = require("../../../middlewares/validationMiddleware");
const lesson_joi_1 = require("../controller/lesson.joi");
function CourseLessonRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(lesson_type_1.CourseLessonDITypes.CONTROLLER);
    router.post("/", authenticationMiddleware, (0, validationMiddleware_1.validationMiddleware)({
        body: lesson_joi_1.CreateCourseLessonDtoJoi,
    }), controller.createLesson.bind(controller));
    router.get(lesson_type_1.courseLessonUrls.lesson, authenticationMiddleware, controller.getLessonById.bind(controller));
    router.put(lesson_type_1.courseLessonUrls.lesson, authenticationMiddleware, (0, validationMiddleware_1.validationMiddleware)({
        body: lesson_joi_1.UpdateCourseLessonDtoJoi,
    }), controller.updateLesson.bind(controller));
    router.delete(lesson_type_1.courseLessonUrls.lesson, authenticationMiddleware, controller.deleteLesson.bind(controller));
    return router;
}
exports.default = CourseLessonRouter;
