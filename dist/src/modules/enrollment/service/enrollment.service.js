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
exports.CourseEnrollmentService = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const enrollment_type_1 = require("../enrollment.type");
const course_type_1 = require("../../course/course.type");
const handleRepositoryError_1 = __importDefault(require("../../../common/functions/handleRepositoryError"));
let CourseEnrollmentService = class CourseEnrollmentService {
    /**
     *
     * Course & Enrollment existence and their relation should be checked in Repository layer while authorizing because
     * it's necessary to lock the rows while performing the features.
     *
     * So no need to implement those type of business logic in Service layer.
     *
     */
    createEnrollment(resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.createEnrollment(resourceId, dto);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error, {
                    uniqueConstraint: {
                        default: {
                            message: enrollment_type_1.CourseEnrollmentErrorMessage.TARGET_USER_IS_ALREADY_ENROLLED,
                        },
                    },
                    foreignConstraint: {
                        default: {
                            message: enrollment_type_1.CourseEnrollmentErrorMessage.TARGET_USER_DOES_NOT_EXIST.concat(" or ", course_type_1.CourseErrorMessage.COURSE_DOES_NOT_EXIST),
                        },
                    },
                });
            }
        });
    }
    updateEnrollmentRole(enrollmentId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.updateEnrollmentRole(enrollmentId, resourceId, dto);
        });
    }
    deleteEnrollment(enrollmentId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.deleteEnrollment(enrollmentId, resourceId);
        });
    }
};
exports.CourseEnrollmentService = CourseEnrollmentService;
__decorate([
    (0, inversify_1.inject)(enrollment_type_1.CourseEnrollmentDITypes.REPOSITORY),
    __metadata("design:type", Object)
], CourseEnrollmentService.prototype, "repository", void 0);
__decorate([
    (0, inversify_1.inject)(course_type_1.CourseDITypes.REPOSITORY),
    __metadata("design:type", Object)
], CourseEnrollmentService.prototype, "courseRepository", void 0);
exports.CourseEnrollmentService = CourseEnrollmentService = __decorate([
    (0, inversify_1.injectable)()
], CourseEnrollmentService);
