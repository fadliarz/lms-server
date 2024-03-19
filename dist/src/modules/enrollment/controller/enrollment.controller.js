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
exports.CourseEnrollmentController = void 0;
const inversify_1 = require("inversify");
const enrollment_type_1 = require("../enrollment.type");
const statusCode_1 = require("../../../common/constants/statusCode");
const getRequestUserOrThrowAuthenticationException_1 = __importDefault(require("../../../common/functions/getRequestUserOrThrowAuthenticationException"));
const NaNException_1 = __importDefault(require("../../../common/class/exceptions/NaNException"));
const validateJoi_1 = __importDefault(require("../../../common/functions/validateJoi"));
const enrollment_joi_1 = require("./enrollment.joi");
const removeNullFields_1 = __importDefault(require("../../../common/functions/removeNullFields"));
let CourseEnrollmentController = class CourseEnrollmentController {
    createEnrollment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({
                    body: enrollment_joi_1.CreateCourseEnrollmentDtoJoi,
                })(req, res, next);
                const resourceId = this.validateResourceId(req);
                const newEnrollment = yield this.service.createEnrollment(resourceId, req.body);
                return res
                    .status(statusCode_1.StatusCode.RESOURCE_CREATED)
                    .json({ data: (0, removeNullFields_1.default)(newEnrollment) });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateEnrollmentRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: enrollment_joi_1.UpdateCourseEnrollmentRoleDtoJoi })(req, res, next);
                const enrollmentId = this.validateEnrollmentId(req);
                const resourceId = this.validateResourceId(req);
                const updatedEnrollment = yield this.service.updateEnrollmentRole(enrollmentId, resourceId, req.body);
                return res
                    .status(statusCode_1.StatusCode.SUCCESS)
                    .json({ data: (0, removeNullFields_1.default)(updatedEnrollment) });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteEnrollment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const enrollmentId = this.validateEnrollmentId(req);
                const resourceId = this.validateResourceId(req);
                const deletedEnrollment = yield this.service.deleteEnrollment(enrollmentId, resourceId);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({});
            }
            catch (error) {
                next(error);
            }
        });
    }
    validateResourceId(req, error) {
        const { id: userId } = (0, getRequestUserOrThrowAuthenticationException_1.default)(req);
        const courseId = Number(req.params.courseId);
        if (isNaN(courseId)) {
            throw error || new NaNException_1.default("courseId");
        }
        return {
            userId,
            courseId,
        };
    }
    validateEnrollmentId(req, error) {
        const enrollmentId = Number(req.params.enrollmentId);
        if (isNaN(enrollmentId)) {
            throw error || new NaNException_1.default("enrollmentId");
        }
        return enrollmentId;
    }
};
exports.CourseEnrollmentController = CourseEnrollmentController;
__decorate([
    (0, inversify_1.inject)(enrollment_type_1.CourseEnrollmentDITypes.SERVICE),
    __metadata("design:type", Object)
], CourseEnrollmentController.prototype, "service", void 0);
exports.CourseEnrollmentController = CourseEnrollmentController = __decorate([
    (0, inversify_1.injectable)()
], CourseEnrollmentController);
