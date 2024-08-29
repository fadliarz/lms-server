"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const assignment_type_1 = require("../assignment.type");
const assignment_api_1 = require("../assignment.api");
function PersonalAssignmentRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(assignment_type_1.PersonalAssignmentDITypes.CONTROLLER);
    /**
     * Create
     *
     */
    router.post(assignment_api_1.$PersonalAssignmentAPI.CreateAssignment.endpoint, authenticationMiddleware, controller.createAssignment.bind(controller));
    /**
     * Update
     *
     */
    router.patch(assignment_api_1.$PersonalAssignmentAPI.UpdateAssignment.endpoint, authenticationMiddleware, controller.updateAssignment.bind(controller));
    /**
     * Delete
     *
     */
    router.delete(assignment_api_1.$PersonalAssignmentAPI.DeleteAssignment.endpoint, authenticationMiddleware, controller.deleteAssignment.bind(controller));
    return router;
}
exports.default = PersonalAssignmentRouter;
