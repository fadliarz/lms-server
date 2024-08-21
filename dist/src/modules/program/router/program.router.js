"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const program_type_1 = require("../program.type");
function DepartmentDivisionProgramRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(program_type_1.DepartmentProgramDITypes.CONTROLLER);
    /**
     * Create
     *
     */
    router.post(program_type_1.$DepartmentProgramAPI.CreateProgram.endpoint, authenticationMiddleware, controller.createProgram.bind(controller));
    /**
     * Get
     *
     */
    router.get(program_type_1.$DepartmentProgramAPI.GetAllPrograms.endpoint, authenticationMiddleware, controller.getAllPrograms.bind(controller));
    router.get(program_type_1.$DepartmentProgramAPI.GetPrograms.endpoint, authenticationMiddleware, controller.getPrograms.bind(controller));
    router.get(program_type_1.$DepartmentProgramAPI.GetProgramById.endpoint, authenticationMiddleware, controller.getProgramById.bind(controller));
    /**
     * Update
     *
     */
    router.patch(program_type_1.$DepartmentProgramAPI.UpdateProgram.endpoint, authenticationMiddleware, controller.updateProgram.bind(controller));
    /**
     * Delete
     *
     */
    router.delete(program_type_1.$DepartmentProgramAPI.DeleteProgram.endpoint, authenticationMiddleware, controller.deleteProgram.bind(controller));
    return router;
}
exports.default = DepartmentDivisionProgramRouter;
