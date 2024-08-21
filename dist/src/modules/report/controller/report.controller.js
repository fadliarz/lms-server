"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const validateJoi_1 = __importDefault(require("../../../common/functions/validateJoi"));
const statusCode_1 = require("../../../common/constants/statusCode");
const getRequestUserOrThrowAuthenticationException_1 = __importDefault(require("../../../common/functions/getRequestUserOrThrowAuthenticationException"));
const NaNException_1 = __importDefault(require("../../../common/class/exceptions/NaNException"));
const report_type_1 = require("../report.type");
const report_joi_1 = require("./report.joi");
let ReportController = class ReportController {
    getReports(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = (0, getRequestUserOrThrowAuthenticationException_1.default)(req);
                const reports = yield this.service.getReports({ user });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: reports,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getReportById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reportId = this.validateReportId(req);
                const resourceId = this.validateResourceId(req);
                const report = yield this.service.getReportById(reportId, resourceId);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: report,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateReport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({
                    body: report_joi_1.UpdateReportDtoJoi,
                })(req, res, next);
                const reportId = this.validateReportId(req);
                const resourceId = this.validateResourceId(req);
                const updatedReport = yield this.service.updateReport(reportId, resourceId, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: updatedReport,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    validateResourceId(req) {
        const user = (0, getRequestUserOrThrowAuthenticationException_1.default)(req);
        const targetUserId = Number(req.params.userId);
        if (isNaN(targetUserId)) {
            throw new NaNException_1.default("userId");
        }
        return {
            user,
            targetUserId,
        };
    }
    validateReportId(req) {
        const reportId = Number(req.params.validateReportId);
        if (isNaN(reportId)) {
            throw new NaNException_1.default("reportId");
        }
        return reportId;
    }
};
__decorate([
    (0, inversify_1.inject)(report_type_1.ReportDITypes.SERVICE),
    __metadata("design:type", Object)
], ReportController.prototype, "service", void 0);
ReportController = __decorate([
    (0, inversify_1.injectable)()
], ReportController);
exports.default = ReportController;
