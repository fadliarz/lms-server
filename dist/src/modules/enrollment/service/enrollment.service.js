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
require("reflect-metadata");
const inversify_1 = require("inversify");
const enrollment_type_1 = require("../enrollment.type");
const handleRepositoryError_1 = __importDefault(require("../../../common/functions/handleRepositoryError"));
let CourseEnrollmentService = class CourseEnrollmentService {
    createEnrollment(resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.authorization.authorizeCreateEnrollment(resourceId.user, dto);
                return yield this.repository.createEnrollment(resourceId.params, dto);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    updateEnrollment(enrollmentId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.authorization.authorizeUpdateEnrollmentRole(resourceId.user);
                return yield this.repository.updateEnrollment({ enrollmentId, resourceId: resourceId.params }, dto);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    deleteEnrollment(enrollmentId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeDeleteEnrollment(resourceId.user, enrollmentId);
                return yield this.repository.deleteEnrollment({
                    enrollmentId,
                    resourceId: resourceId.params,
                });
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(enrollment_type_1.CourseEnrollmentDITypes.REPOSITORY),
    __metadata("design:type", Object)
], CourseEnrollmentService.prototype, "repository", void 0);
__decorate([
    (0, inversify_1.inject)(enrollment_type_1.CourseEnrollmentDITypes.AUTHORIZATION),
    __metadata("design:type", Object)
], CourseEnrollmentService.prototype, "authorization", void 0);
CourseEnrollmentService = __decorate([
    (0, inversify_1.injectable)()
], CourseEnrollmentService);
exports.default = CourseEnrollmentService;
