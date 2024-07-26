"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const class_type_1 = require("../class.type");
function CourseClassRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(class_type_1.CourseClassDITypes.CONTROLLER);
    /**
     * Create
     *
     */
    router.post(class_type_1.courseClassUrls.root, authenticationMiddleware, controller.createClass.bind(controller));
    /**
     * Get
     *
     */
    router.get(class_type_1.courseClassUrls.class, authenticationMiddleware, controller.getClassById.bind(controller));
    router.get(class_type_1.courseClassUrls.root, authenticationMiddleware, controller.getClasses.bind(controller));
    /**
     * Update
     *
     */
    router.patch(class_type_1.courseClassUrls.class, authenticationMiddleware, controller.updateClass.bind(controller));
    /**
     * Delete
     *
     */
    router.delete(class_type_1.courseClassUrls.class, authenticationMiddleware, controller.deleteClass.bind(controller));
}
exports.default = CourseClassRouter;
