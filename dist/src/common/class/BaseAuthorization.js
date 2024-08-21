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
exports.BaseAuthorizationDITypes = void 0;
require("reflect-metadata");
const getRoleStatus_1 = __importDefault(require("../functions/getRoleStatus"));
const isEqualOrIncludeCourseEnrollmentRole_1 = __importDefault(require("../functions/isEqualOrIncludeCourseEnrollmentRole"));
const course_type_1 = require("../../modules/course/course.type");
const InternalServerException_1 = __importDefault(require("./exceptions/InternalServerException"));
const inversify_1 = require("inversify");
const prisma_query_raw_type_1 = require("./prisma_query_raw/prisma_query_raw.type");
const AuthenticationException_1 = __importDefault(require("./exceptions/AuthenticationException"));
const RecordNotFoundException_1 = __importDefault(require("./exceptions/RecordNotFoundException"));
const repository_type_1 = require("./repository/repository.type");
exports.BaseAuthorizationDITypes = Symbol.for("COMMON_CLASS_BASE_AUTHORIZATION");
let BaseAuthorization = class BaseAuthorization {
    authorizeFromDepartmentDivision(userId, privilege) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.globalRepository.user.getUserAuthorizationStatusFromPrivilege({ userId }, privilege);
        });
    }
    isAuthor(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const author = yield this.globalRepository.course.getCourseAuthorByIdOrThrow({
                courseId,
            }, { minimalist: true });
            return !!(author && author.id === userId);
        });
    }
    authorizeUserRole(tx, resourceId, fn) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: userId }, } = resourceId;
            const user = yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, userId, new AuthenticationException_1.default());
            const { isStudent, isInstructor, isAdmin } = (0, getRoleStatus_1.default)(user.role);
            if (!isStudent && !isInstructor && !isAdmin) {
                throw new InternalServerException_1.default();
            }
            fn(user);
            return user;
        });
    }
    authorize(tx, resourceId, fn) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: userId }, courseId, } = resourceId;
            const user = yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, userId, new AuthenticationException_1.default());
            const course = yield this.prismaQueryRaw.course.selectForUpdateByIdOrThrow(tx, courseId, new RecordNotFoundException_1.default("Course doesn't exist!"));
            const enrollment = yield this.prismaQueryRaw.courseEnrollment.selectForUpdateByUserIdAndCourseId(tx, {
                userId,
                courseId,
            });
            const { isStudent, isInstructor, isAdmin } = (0, getRoleStatus_1.default)(user.role);
            if (!isStudent && !isInstructor && !isAdmin) {
                throw new InternalServerException_1.default();
            }
            fn(user, course, enrollment);
            return {
                user,
                course,
                enrollment,
            };
        });
    }
    validateUnexpectedScenarios(user, course, enrollment) {
        const { id: userId, role: userRole } = user;
        const { authorId } = course;
        const isAuthor = userId === authorId;
        const { isStudent, isInstructor, isAdmin } = (0, getRoleStatus_1.default)(userRole);
        if (!isStudent && !isInstructor && !isAdmin) {
            throw new InternalServerException_1.default();
        }
        /**
         * Some unexpected scenarios:
         *
         * 1. isStudent but enrolled as Instructor
         * 2. isStudent but also isAuthor
         * 3. isAuthor but also enrolled
         *
         */
        if ((isStudent &&
            enrollment &&
            (0, isEqualOrIncludeCourseEnrollmentRole_1.default)(enrollment.role, course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR)) ||
            (isStudent && isAuthor) ||
            (isAuthor && enrollment)) {
            throw new InternalServerException_1.default();
        }
    }
};
__decorate([
    (0, inversify_1.inject)(repository_type_1.RepositoryDITypes.FACADE),
    __metadata("design:type", repository_type_1.IRepository)
], BaseAuthorization.prototype, "globalRepository", void 0);
__decorate([
    (0, inversify_1.inject)(prisma_query_raw_type_1.PrismaQueryRawDITypes.PRISMA_QUERY_RAW),
    __metadata("design:type", Object)
], BaseAuthorization.prototype, "prismaQueryRaw", void 0);
BaseAuthorization = __decorate([
    (0, inversify_1.injectable)()
], BaseAuthorization);
exports.default = BaseAuthorization;
