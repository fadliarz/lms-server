"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const enrollment_type_1 = require("../enrollment.type");
function DepartmentProgramEnrollmentRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(enrollment_type_1.DepartmentProgramEnrollmentDITypes.CONTROLLER);
    /**
     * Create
     *
     */
    router.post(enrollment_type_1.$DepartmentProgramEnrollmentAPI.CreateEnrollment.endpoint, authenticationMiddleware, controller.createEnrollment.bind(controller));
    /**
     * Delete
     *
     */
    router.delete(enrollment_type_1.$DepartmentProgramEnrollmentAPI.DeleteEnrollment.endpoint, authenticationMiddleware, controller.deleteEnrollment.bind(controller));
    return router;
}
exports.default = DepartmentProgramEnrollmentRouter;
