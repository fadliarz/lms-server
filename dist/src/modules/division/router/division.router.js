"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const division_type_1 = require("../division.type");
function DepartmentDivisionRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(division_type_1.DepartmentDivisionDITypes.CONTROLLER);
    /**
     * Create
     *
     */
    router.post(division_type_1.$DepartmentDivisionAPI.CreateDivision.endpoint, authenticationMiddleware, controller.createDivision.bind(controller));
    /**
     * Get
     *
     */
    router.get(division_type_1.$DepartmentDivisionAPI.GetDivisions.endpoint, authenticationMiddleware, controller.getDivisions.bind(controller));
    router.get(division_type_1.$DepartmentDivisionAPI.GetDivisionById.endpoint, authenticationMiddleware, controller.getDivisionById.bind(controller));
    /**
     * Update
     *
     */
    router.patch(division_type_1.$DepartmentDivisionAPI.UpdateDivision.endpoint, authenticationMiddleware, controller.updateDivision.bind(controller));
    router.patch(division_type_1.$DepartmentDivisionAPI.UpdateDivisionLeaderId.endpoint, authenticationMiddleware, controller.updateDivisionLeaderId.bind(controller));
    router.patch(division_type_1.$DepartmentDivisionAPI.UpdateDivisionCoLeaderId.endpoint, authenticationMiddleware, controller.updateDivisionCoLeaderId.bind(controller));
    /**
     * Delete
     *
     */
    router.delete(division_type_1.$DepartmentDivisionAPI.DeleteDivision.endpoint, authenticationMiddleware, controller.deleteDivision.bind(controller));
    return router;
}
exports.default = DepartmentDivisionRouter;
