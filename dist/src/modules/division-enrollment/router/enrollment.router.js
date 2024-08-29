"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const enrollment_type_1 = require("../enrollment.type");
const enrollment_api_1 = require("../enrollment.api");
function DepartmentDivisionEnrollmentRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(enrollment_type_1.DepartmentDivisionEnrollmentDITypes.CONTROLLER);
    /**
     * Create
     *
     */
    router.post(enrollment_api_1.$DepartmentDivisionEnrollmentAPI.CreateEnrollment.endpoint, authenticationMiddleware, controller.createEnrollment.bind(controller));
    /**
     * Get
     *
     */
    router.get(enrollment_api_1.$DepartmentDivisionEnrollmentAPI.GetEnrollments.endpoint, authenticationMiddleware, controller.getEnrollments.bind(controller));
    /**
     * Delete
     *
     */
    router.delete(enrollment_api_1.$DepartmentDivisionEnrollmentAPI.DeleteEnrollment.endpoint, authenticationMiddleware, controller.deleteEnrollment.bind(controller));
    return router;
}
exports.default = DepartmentDivisionEnrollmentRouter;
