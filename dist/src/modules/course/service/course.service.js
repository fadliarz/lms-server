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
const course_type_1 = require("../course.type");
const handleRepositoryError_1 = __importDefault(require("../../../common/functions/handleRepositoryError"));
const repository_type_1 = require("../../../common/class/repository/repository.type");
const isEqualOrIncludeCourseEnrollmentRole_1 = __importDefault(require("../../../common/functions/isEqualOrIncludeCourseEnrollmentRole"));
let CourseService = class CourseService {
    createCourse(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeCreateCourse(id.resourceId.user);
                return yield this.repository.createCourse(Object.assign(Object.assign({}, dto), { authorId: id.resourceId.user.id }));
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    createCourseInstructor(user, id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeCreateCourseInstructor(user);
                const enrollment = yield this.globalRepository.courseEnrollment.getEnrollmentByUserIdAndCourseId({
                    userId: dto.userId,
                    courseId: id.courseId,
                });
                if (enrollment) {
                    if ((0, isEqualOrIncludeCourseEnrollmentRole_1.default)(enrollment.role, course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR)) {
                        return enrollment;
                    }
                    return yield this.globalRepository.courseEnrollment.updateEnrollment({ enrollmentId: enrollment.id }, { role: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR });
                }
                return yield this.globalRepository.courseEnrollment.createEnrollment({ courseId: id.courseId }, {
                    userId: dto.userId,
                    role: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                });
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    getCourses(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.getCourses(query);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    getCourseById(id, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.getCourseByIdOrThrow(id, query);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    getCourseInstructors(user, id, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeGetCourseInstructors(user);
                return yield this.repository.getCourseInstructors(id, query);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    updateCourse(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeUpdateCourse(id.resourceId.user, id.courseId);
                return yield this.repository.updateCourse(id, dto);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    updateCourseStatus(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeUpdateCourse(id.resourceId.user, id.courseId);
                return yield this.repository.updateCourse(id, dto);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    updateCourseCategoryId(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeUpdateCourse(id.resourceId.user, id.courseId);
                return yield this.repository.updateCourse(id, dto);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    updateCourseCode(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeUpdateCourse(id.resourceId.user, id.courseId);
                return yield this.repository.updateCourse(id, dto);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    deleteCourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeDeleteCourse(id.resourceId.user, id.courseId);
                return yield this.repository.deleteCourse(id);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    createLike(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeCreateLike(id.resourceId.user, id.resourceId.params.courseId);
                return yield this.repository.createLike({
                    courseId: id.resourceId.params.courseId,
                }, {
                    userId: id.resourceId.user.id,
                });
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    deleteLike(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeDeleteLike(id.resourceId.user, id.resourceId.params.courseId, id.likeId);
                return yield this.repository.deleteLike({
                    likeId: id.likeId,
                });
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(course_type_1.CourseDITypes.REPOSITORY),
    __metadata("design:type", Object)
], CourseService.prototype, "repository", void 0);
__decorate([
    (0, inversify_1.inject)(repository_type_1.RepositoryDITypes.FACADE),
    __metadata("design:type", repository_type_1.IRepository)
], CourseService.prototype, "globalRepository", void 0);
__decorate([
    (0, inversify_1.inject)(course_type_1.CourseDITypes.AUTHORIZATION),
    __metadata("design:type", Object)
], CourseService.prototype, "authorization", void 0);
CourseService = __decorate([
    (0, inversify_1.injectable)()
], CourseService);
exports.default = CourseService;
