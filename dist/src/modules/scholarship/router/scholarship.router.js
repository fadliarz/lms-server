"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const scholarship_type_1 = require("../scholarship.type");
const scholarship_api_1 = require("../scholarship.api");
function ScholarshipRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(scholarship_type_1.ScholarshipDITypes.CONTROLLER);
    /**
     * Create
     *
     */
    router.post(scholarship_api_1.$ScholarshipAPI.CreateScholarship.endpoint, authenticationMiddleware, controller.createScholarship.bind(controller));
    /**
     * Get
     *
     */
    router.get(scholarship_api_1.$ScholarshipAPI.GetScholarships.endpoint, authenticationMiddleware, controller.getScholarships.bind(controller));
    router.get(scholarship_api_1.$ScholarshipAPI.GetScholarshipById.endpoint, authenticationMiddleware, controller.getScholarshipById.bind(controller));
    /**
     * Update
     *
     */
    router.patch(scholarship_api_1.$ScholarshipAPI.UpdateScholarship.endpoint, authenticationMiddleware, controller.updateScholarship.bind(controller));
    /**
     * Delete
     *
     */
    router.delete(scholarship_api_1.$ScholarshipAPI.DeleteScholarship.endpoint, authenticationMiddleware, controller.deleteScholarship.bind(controller));
    return router;
}
exports.default = ScholarshipRouter;
