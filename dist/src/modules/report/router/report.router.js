"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const report_type_1 = require("../report.type");
const report_api_1 = require("../report.api");
function ReportRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(report_type_1.ReportDITypes.CONTROLLER);
    /**
     * Get
     *
     */
    router.get(report_api_1.$ReportAPI.GetReports.endpoint, authenticationMiddleware, controller.getReports.bind(controller));
    router.get(report_api_1.$ReportAPI.GetReportById.endpoint, authenticationMiddleware, controller.getReportById.bind(controller));
    /**
     * Update
     *
     */
    router.patch(report_api_1.$ReportAPI.UpdateReport.endpoint, authenticationMiddleware, controller.updateReport.bind(controller));
    return router;
}
exports.default = ReportRouter;
