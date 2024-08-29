"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const class_type_1 = require("../class.type");
const class_api_1 = require("../class.api");
function CourseClassRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(class_type_1.CourseClassDITypes.CONTROLLER);
    /**
     * Create
     *
     */
    router.post(class_api_1.$CourseClassAPI.CreateClass.endpoint, authenticationMiddleware, controller.createClass.bind(controller));
    /**
     * Get
     *
     */
    router.get(class_api_1.$CourseClassAPI.GetClasses.endpoint, authenticationMiddleware, controller.getClasses.bind(controller));
    router.get(class_api_1.$CourseClassAPI.GetClassById.endpoint, authenticationMiddleware, controller.getClassById.bind(controller));
    /**
     * Update
     *
     */
    router.patch(class_api_1.$CourseClassAPI.UpdateClass.endpoint, authenticationMiddleware, controller.updateClass.bind(controller));
    /**
     * Delete
     *
     */
    router.delete(class_api_1.$CourseClassAPI.DeleteClass.endpoint, authenticationMiddleware, controller.deleteClass.bind(controller));
    return router;
}
exports.default = CourseClassRouter;
