"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const department_type_1 = require("../department.type");
const department_api_1 = require("../department.api");
function DepartmentRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(department_type_1.DepartmentDITypes.CONTROLLER);
    /**
     * Create
     *
     */
    router.post(department_api_1.$DepartmentAPI.CreateDepartment.endpoint, authenticationMiddleware, controller.createDepartment.bind(controller));
    /**
     * Get
     *
     */
    router.get(department_api_1.$DepartmentAPI.GetDepartments.endpoint, authenticationMiddleware, controller.getDepartments.bind(controller));
    router.get(department_api_1.$DepartmentAPI.GetDepartmentById.endpoint, authenticationMiddleware, controller.getDepartmentById.bind(controller));
    /**
     * Update
     *
     */
    router.patch(department_api_1.$DepartmentAPI.UpdateDepartment.endpoint, authenticationMiddleware, controller.updateDepartment.bind(controller));
    router.patch(department_api_1.$DepartmentAPI.UpdateDepartmentLeaderId.endpoint, authenticationMiddleware, controller.updateDepartmentLeaderId.bind(controller));
    router.patch(department_api_1.$DepartmentAPI.UpdateDepartmentCoLeaderId.endpoint, authenticationMiddleware, controller.updateDepartmentCoLeaderId.bind(controller));
    /**
     * Delete
     *
     */
    router.delete(department_api_1.$DepartmentAPI.DeleteDepartment.endpoint, authenticationMiddleware, controller.deleteDepartment.bind(controller));
    return router;
}
exports.default = DepartmentRouter;
