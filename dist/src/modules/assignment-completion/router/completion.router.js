"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const completion_type_1 = require("../completion.type");
const completion_api_1 = require("../completion.api");
function CourseClassAssignmentCompletionRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(completion_type_1.CourseClassAssignmentCompletionDITypes.CONTROLLER);
    /**
     * Create
     *
     */
    router.post(completion_api_1.$CourseClassAssignmentCompletionAPI.CreateCompletion.endpoint, authenticationMiddleware, controller.createCompletion.bind(controller));
    /**
     * Update
     *
     */
    router.patch(completion_api_1.$CourseClassAssignmentCompletionAPI.UpdateCompletion.endpoint, authenticationMiddleware, controller.updateCompletion);
    /**
     * Delete
     *
     */
    router.delete(completion_api_1.$CourseClassAssignmentCompletionAPI.DeleteCompletion.endpoint, authenticationMiddleware, controller.deleteCompletion.bind(controller));
    return router;
}
exports.default = CourseClassAssignmentCompletionRouter;
