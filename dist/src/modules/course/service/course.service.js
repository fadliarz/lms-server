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
exports.CourseService = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
const repository_type_1 = require("../../../common/class/repository/repository.type");
const handleRepositoryError_1 = __importDefault(require("../../../common/functions/handleRepositoryError"));
const getRoleStatus_1 = __importDefault(require("../../../common/functions/getRoleStatus"));
const AuthorizationException_1 = __importDefault(require("../../../common/class/exceptions/AuthorizationException"));
const ClientException_1 = __importDefault(require("../../../common/class/exceptions/ClientException"));
/**
 * Todo: Implement Unit of Work pattern, so transaction can be shared across layers
 *
 */
let CourseService = class CourseService {
    createCourse(resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.course.createCourse(resourceId, dto);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error, {
                    foreignConstraint: {
                        default: { message: "Category doesn't exist!" },
                    },
                });
            }
        });
    }
    getCourseById(courseId, resourceId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.course.getCourseByIdOrThrow(courseId, resourceId, query, new RecordNotFoundException_1.default());
        });
    }
    getCourses(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.course.getCourses(query);
        });
    }
    getEnrolledCourses(resourceId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.course.getEnrolledCourses(resourceId, query);
        });
    }
    updateBasicCourse(courseId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.course.updateCourse(courseId, resourceId, dto);
        });
    }
    updateCourseStatus(courseId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.course.updateCourse(courseId, resourceId, dto);
        });
    }
    updateCourseCategoryId(courseId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.course.updateCourse(courseId, resourceId, dto);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error, {
                    foreignConstraint: {
                        default: { message: "Category doesn't exist!" },
                    },
                });
            }
        });
    }
    deleteCourse(courseId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.course.deleteCourse(courseId, resourceId);
            return {};
        });
    }
    createLike(resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.course.createLike(resourceId);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error, {
                    uniqueConstraint: {
                        default: { message: "Like already exists!" },
                    },
                });
            }
        });
    }
    deleteLike(likeId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateRelationBetweenResources({
                likeId,
                resourceId,
            });
            yield this.repository.course.deleteLike(likeId, resourceId);
            return {};
        });
    }
    validateRelationBetweenResources(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { likeId, resourceId } = id;
            const { courseId, user: { id: userId, role }, } = resourceId;
            const { isAdmin } = (0, getRoleStatus_1.default)(role);
            const like = yield this.repository.course.getLikeById(likeId, resourceId);
            if (!like || like.courseId !== courseId) {
                if (!isAdmin) {
                    throw new AuthorizationException_1.default();
                }
                if (!like) {
                    throw new RecordNotFoundException_1.default("like doesn't exist!");
                }
                if (like.courseId !== courseId) {
                    throw new ClientException_1.default("course_likeId doesn't match likeId!");
                }
            }
            return like;
        });
    }
};
exports.CourseService = CourseService;
__decorate([
    (0, inversify_1.inject)(repository_type_1.RepositoryDITypes.FACADE),
    __metadata("design:type", repository_type_1.IRepository)
], CourseService.prototype, "repository", void 0);
exports.CourseService = CourseService = __decorate([
    (0, inversify_1.injectable)()
], CourseService);
