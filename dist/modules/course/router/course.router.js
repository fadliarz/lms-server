"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const course_type_1 = require("../course.type");
const course_type_2 = require("../course.type");
const client_1 = require("@prisma/client");
const course_joi_1 = require("../controller/course.joi");
const validationMiddleware_1 = require("../../../middlewares/validationMiddleware");
function CourseRouter(authorizationMiddleware) {
    const router = express_1.default.Router();
    const courseControllerInstance = inversifyConfig_1.default.get(course_type_1.CourseDITypes.COURSE_CONTROLLER);
    router.post(course_type_2.courseUrls.create, (0, validationMiddleware_1.validationMiddleware)(course_joi_1.CreateCourse), authorizationMiddleware([client_1.Role.INSTRUCTOR]), courseControllerInstance.createCourse.bind(courseControllerInstance));
    return router;
}
exports.default = CourseRouter;
