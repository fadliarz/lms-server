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
const scholarship_type_1 = require("../scholarship.type");
const scholarship_joi_1 = require("./scholarship.joi");
let ScholarshipController = class ScholarshipController {
    createScholarship(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, validateJoi_1.default)({ body: scholarship_joi_1.CreateScholarshipDtoJoi });
                const user = (0, getRequestUserOrThrowAuthenticationException_1.default)(req);
                const newScholarship = yield this.service.createScholarship(user, req.body);
                return res.status(statusCode_1.StatusCode.RESOURCE_CREATED).json({
                    data: newScholarship,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getScholarships(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, getRequestUserOrThrowAuthenticationException_1.default)(req);
                const scholarships = yield this.service.getScholarships();
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: scholarships,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getScholarshipById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, getRequestUserOrThrowAuthenticationException_1.default)(req);
                const scholarshipId = this.validateScholarshipId(req);
                const scholarship = yield this.service.getScholarshipById(scholarshipId);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: scholarship,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateScholarship(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({
                    body: scholarship_joi_1.UpdateScholarshipDtoJoi,
                })(req, res, next);
                const user = (0, getRequestUserOrThrowAuthenticationException_1.default)(req);
                const scholarshipId = this.validateScholarshipId(req);
                const updatedReport = yield this.service.updateScholarship(scholarshipId, user, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: updatedReport,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteScholarship(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = (0, getRequestUserOrThrowAuthenticationException_1.default)(req);
                const scholarshipId = this.validateScholarshipId(req);
                const result = yield this.service.deleteScholarship(scholarshipId, user);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: result,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    validateScholarshipId(req) {
        const scholarshipId = Number(req.params.scholarshipId);
        if (isNaN(scholarshipId)) {
            throw new NaNException_1.default("scholarshipId");
        }
        return scholarshipId;
    }
};
__decorate([
    (0, inversify_1.inject)(scholarship_type_1.ScholarshipDITypes.SERVICE),
    __metadata("design:type", Object)
], ScholarshipController.prototype, "service", void 0);
ScholarshipController = __decorate([
    (0, inversify_1.injectable)()
], ScholarshipController);
exports.default = ScholarshipController;
