"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportDITypes = exports.$ReportAPI = void 0;
var $ReportAPI;
(function ($ReportAPI) {
    const root = "/users/:userId/reports";
    const report = root + "/:reportId";
    let GetReports;
    (function (GetReports) {
        GetReports.endpoint = "/reports";
        GetReports.generateUrl = () => GetReports.endpoint;
    })(GetReports = $ReportAPI.GetReports || ($ReportAPI.GetReports = {}));
    let GetReportById;
    (function (GetReportById) {
        GetReportById.endpoint = report;
        GetReportById.generateUrl = (userId, reportId) => `/users/${userId}/reports/${reportId}`;
    })(GetReportById = $ReportAPI.GetReportById || ($ReportAPI.GetReportById = {}));
    let UpdateReport;
    (function (UpdateReport) {
        UpdateReport.endpoint = report;
        UpdateReport.generateUrl = (userId, reportId) => `/users/${userId}/reports/${reportId}`;
    })(UpdateReport = $ReportAPI.UpdateReport || ($ReportAPI.UpdateReport = {}));
})($ReportAPI || (exports.$ReportAPI = $ReportAPI = {}));
exports.ReportDITypes = {
    REPOSITORY: Symbol.for("REPORT_REPOSITORY"),
    SERVICE: Symbol.for("REPORT_SERVICE"),
    CONTROLLER: Symbol.for("REPORT_CONTROLLER"),
    AUTHORIZATION: Symbol.for("REPORT_AUTHORIZATION"),
};
