"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const assignment_type_1 = require("../assignment.type");
const assignment_api_1 = require("../assignment.api");
function CourseClassAssignmentRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(assignment_type_1.CourseClassAssignmentDITypes.CONTROLLER);
    /**
     * Create
     *
     */
    router.post(assignment_api_1.$CourseClassAssignmentAPI.CreateAssignment.endpoint, authenticationMiddleware, controller.createAssignment.bind(controller));
    /**
     * Get
     *
     */
    router.get(assignment_api_1.$CourseClassAssignmentAPI.GetAssignments.endpoint, authenticationMiddleware, controller.getAssignments.bind(controller));
    router.get(assignment_api_1.$CourseClassAssignmentAPI.GetAssignmentById.endpoint, authenticationMiddleware, controller.getAssignmentById.bind(controller));
    /**
     * Update
     *
     */
    router.patch(assignment_api_1.$CourseClassAssignmentAPI.UpdateAssignment.endpoint, authenticationMiddleware, controller.updateAssignment.bind(controller));
    /**
     * Delete
     *
     */
    router.delete(assignment_api_1.$CourseClassAssignmentAPI.DeleteAssignment.endpoint, authenticationMiddleware, controller.deleteAssignment.bind(controller));
    return router;
}
exports.default = CourseClassAssignmentRouter;
