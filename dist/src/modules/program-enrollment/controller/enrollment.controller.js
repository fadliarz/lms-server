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
const enrollment_type_1 = require("../enrollment.type");
const validateJoi_1 = __importDefault(require("../../../common/functions/validateJoi"));
const statusCode_1 = require("../../../common/constants/statusCode");
const isNaNArray_1 = __importDefault(require("../../../common/functions/isNaNArray"));
const NaNException_1 = __importDefault(require("../../../common/class/exceptions/NaNException"));
const enrollment_joi_1 = require("./enrollment.joi");
const getRequestUserOrThrowAuthenticationException_1 = __importDefault(require("../../../common/functions/getRequestUserOrThrowAuthenticationException"));
let DepartmentProgramEnrollmentController = class DepartmentProgramEnrollmentController {
    createEnrollment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({
                    body: enrollment_joi_1.CreateDepartmentProgramEnrollmentDtoJoi,
                })(req, res, next);
                const newEnrollment = yield this.service.createEnrollment((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { resourceId: this.validateResourceId(req) }, req.body);
                return res.status(statusCode_1.StatusCode.RESOURCE_CREATED).json({
                    data: newEnrollment,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteEnrollment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.service.deleteEnrollment((0, getRequestUserOrThrowAuthenticationException_1.default)(req), {
                    enrollmentId: this.validateEnrollmentId(req),
                    resourceId: this.validateResourceId(req),
                });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: {},
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    validateResourceId(req) {
        const departmentId = Number(req.params.departmentId);
        const programId = Number(req.params.programId);
        if ((0, isNaNArray_1.default)([departmentId, programId])) {
            throw new NaNException_1.default("departmentId  || programId");
        }
        return {
            departmentId,
            programId,
        };
    }
    validateEnrollmentId(req) {
        const enrollmentId = Number(req.params.enrollmentId);
        if (isNaN(enrollmentId)) {
            throw new NaNException_1.default("enrollmentId");
        }
        return enrollmentId;
    }
};
__decorate([
    (0, inversify_1.inject)(enrollment_type_1.DepartmentProgramEnrollmentDITypes.SERVICE),
    __metadata("design:type", Object)
], DepartmentProgramEnrollmentController.prototype, "service", void 0);
DepartmentProgramEnrollmentController = __decorate([
    (0, inversify_1.injectable)()
], DepartmentProgramEnrollmentController);
exports.default = DepartmentProgramEnrollmentController;
