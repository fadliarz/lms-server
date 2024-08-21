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
const report_type_1 = require("../report.type");
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
const PrismaClientSingleton_1 = __importDefault(require("../../../common/class/PrismaClientSingleton"));
const inversify_1 = require("inversify");
let ReportService = class ReportService {
    constructor() {
        this.prisma = PrismaClientSingleton_1.default.getInstance();
    }
    getReports(resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = resourceId;
            yield this.authorization.authorizeGetReports(user);
            return yield this.repository.getReports();
        });
    }
    getReportById(reportId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, targetUserId } = resourceId;
            yield this.authorization.authorizeGetReportById(user, targetUserId);
            const { report } = yield this.validateRelationBetweenResources({
                resourceId,
                reportId,
            });
            return report;
        });
    }
    updateReport(reportId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, targetUserId } = resourceId;
            yield this.authorization.authorizeUpdateReport(user, targetUserId);
            return this.repository.updateReport(reportId, dto);
        });
    }
    validateRelationBetweenResources(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { resourceId } = id;
            const { targetUserId } = resourceId;
            if (id.reportId) {
                const report = yield this.prisma.report.findFirst({
                    where: {
                        id: id.reportId,
                        user: {
                            id: targetUserId,
                        },
                    },
                });
                if (!report) {
                    throw new RecordNotFoundException_1.default();
                }
                return {
                    report,
                };
            }
            const user = yield this.prisma.user.findUnique({
                where: {
                    id: targetUserId,
                },
                select: {
                    id: true,
                },
            });
            if (!user) {
                throw new RecordNotFoundException_1.default();
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(report_type_1.ReportDITypes.REPOSITORY),
    __metadata("design:type", Object)
], ReportService.prototype, "repository", void 0);
__decorate([
    (0, inversify_1.inject)(report_type_1.ReportDITypes.AUTHORIZATION),
    __metadata("design:type", Object)
], ReportService.prototype, "authorization", void 0);
ReportService = __decorate([
    (0, inversify_1.injectable)()
], ReportService);
exports.default = ReportService;
