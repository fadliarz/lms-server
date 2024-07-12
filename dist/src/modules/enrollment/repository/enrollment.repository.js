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
const client_1 = require("@prisma/client");
const enrollment_type_1 = require("../enrollment.type");
const inversify_1 = require("inversify");
const isEqualOrIncludeRole_1 = __importDefault(require("../../../common/functions/isEqualOrIncludeRole"));
const PrismaClientSingleton_1 = __importDefault(require("../../../common/class/PrismaClientSingleton"));
const enrollment_authorization_1 = __importDefault(require("../authorization/enrollment.authorization"));
const getRoleStatus_1 = __importDefault(require("../../../common/functions/getRoleStatus"));
const ClientException_1 = __importDefault(require("../../../common/class/exceptions/ClientException"));
const isEqualOrIncludeCourseEnrollmentRole_1 = __importDefault(require("../../../common/functions/isEqualOrIncludeCourseEnrollmentRole"));
const course_type_1 = require("../../course/course.type");
const InternalServerException_1 = __importDefault(require("../../../common/class/exceptions/InternalServerException"));
const prisma_query_raw_type_1 = require("../../../common/class/prisma_query_raw/prisma_query_raw.type");
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
const AuthenticationException_1 = __importDefault(require("../../../common/class/exceptions/AuthenticationException"));
let CourseEnrollmentRepository = class CourseEnrollmentRepository {
    constructor() {
        this.prisma = PrismaClientSingleton_1.default.getInstance();
    }
    createEnrollment(resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const { userId, courseId } = resourceId;
                const { userId: targetUserId, role: enrollmentRole } = dto;
                const user = yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, userId, new AuthenticationException_1.default());
                const course = yield this.prismaQueryRaw.course.selectForUpdateByIdOrThrow(tx, courseId, new RecordNotFoundException_1.default(course_type_1.CourseErrorMessage.COURSE_DOES_NOT_EXIST));
                const { isStudent, isInstructor, isAdmin } = (0, getRoleStatus_1.default)(user.role);
                if (!(isStudent || isInstructor || isAdmin)) {
                    throw new InternalServerException_1.default(enrollment_type_1.CourseEnrollmentErrorMessage.UNEXPECTED_SCENARIO);
                }
                this.authorization.authorizeCreateEnrollment(user, course, dto);
                /**
                 *
                 * At this point, user is authorized to create enrollment.
                 *
                 * validate the create enrollment logic.
                 *
                 */
                let targetUser = user;
                const isUserIdEqual = userId === targetUserId;
                if (!isUserIdEqual) {
                    targetUser =
                        yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, targetUserId, new RecordNotFoundException_1.default(enrollment_type_1.CourseEnrollmentErrorMessage.TARGET_USER_DOES_NOT_EXIST));
                }
                const existingTargetEnrollments = yield this.prismaQueryRaw.courseEnrollment.selectForUpdateByUserIdAndCourseId(tx, {
                    userId: targetUserId,
                    courseId,
                });
                if (existingTargetEnrollments) {
                    throw new ClientException_1.default(enrollment_type_1.CourseEnrollmentErrorMessage.TARGET_USER_IS_ALREADY_ENROLLED);
                }
                /**
                 * STUDENT shouldn't be enrolled as Instructor
                 *
                 */
                if ((0, isEqualOrIncludeCourseEnrollmentRole_1.default)(dto.role, course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR) &&
                    (0, isEqualOrIncludeRole_1.default)(targetUser.role, course_type_1.UserRoleModel.STUDENT)) {
                    throw new ClientException_1.default(enrollment_type_1.CourseEnrollmentErrorMessage.STUDENT_SHOULD_NOT_ENROLLED_AS_INSTRUCTOR);
                }
                /**
                 * Author shouldn't be enrolled
                 *
                 */
                if (course.authorId === dto.userId) {
                    throw new ClientException_1.default(enrollment_type_1.CourseEnrollmentErrorMessage.AUTHOR_SHOULD_NOT_BE_ENROLLED);
                }
                return yield tx.courseEnrollment.create({
                    data: Object.assign(Object.assign({}, dto), { courseId }),
                });
            }), {
                maxWait: 5000,
                timeout: 8000,
                isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable,
            });
        });
    }
    updateEnrollmentRole(enrollmentId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const { userId, courseId } = resourceId;
                const user = yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, userId, new AuthenticationException_1.default());
                const course = yield this.prismaQueryRaw.course.selectForUpdateByIdOrThrow(tx, courseId, new RecordNotFoundException_1.default(course_type_1.CourseErrorMessage.COURSE_DOES_NOT_EXIST));
                const enrollment = yield this.prismaQueryRaw.courseEnrollment.selectForUpdateByIdOrThrow(tx, enrollmentId, new RecordNotFoundException_1.default(enrollment_type_1.CourseEnrollmentErrorMessage.ENROLLMENT_DOES_NOT_EXIST));
                /**
                 * validate relation between resources
                 *
                 */
                if (course.id !== enrollment.courseId) {
                    throw new RecordNotFoundException_1.default(enrollment_type_1.CourseEnrollmentErrorMessage.ENROLLMENT_DOES_NOT_EXIST);
                }
                const { isStudent, isInstructor, isAdmin } = (0, getRoleStatus_1.default)(user.role);
                if (!(isStudent || isInstructor || isAdmin)) {
                    throw new InternalServerException_1.default(enrollment_type_1.CourseEnrollmentErrorMessage.UNEXPECTED_SCENARIO);
                }
                this.authorization.authorizeUpdateEnrollmentRole(user, course, enrollment);
                /**
                 *
                 * At this point, user is authorized to update enrollment.
                 *
                 * validate the update enrollment logic.
                 *
                 * 1. target user is STUDENT but new enrollment role is INSTRUCTOR
                 *
                 */
                let targetUser = user;
                const isUserIdEqual = userId === enrollment.userId;
                if (!isUserIdEqual) {
                    targetUser =
                        yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, enrollment.userId, new RecordNotFoundException_1.default(enrollment_type_1.CourseEnrollmentErrorMessage.TARGET_USER_DOES_NOT_EXIST));
                }
                if ((0, isEqualOrIncludeCourseEnrollmentRole_1.default)(dto.role, course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR) &&
                    (0, isEqualOrIncludeRole_1.default)(targetUser.role, course_type_1.UserRoleModel.STUDENT)) {
                    throw new ClientException_1.default(enrollment_type_1.CourseEnrollmentErrorMessage.STUDENT_SHOULD_NOT_ENROLLED_AS_INSTRUCTOR);
                }
                /**
                 *
                 * check for unexpected scenario.
                 *
                 * 1. target user is STUDENT but enrolled as INSTRUCTOR
                 * 2. target user is author
                 *
                 */
                if ((0, isEqualOrIncludeCourseEnrollmentRole_1.default)(enrollment.role, course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR) &&
                    (0, isEqualOrIncludeRole_1.default)(targetUser.role, course_type_1.UserRoleModel.STUDENT)) {
                    throw new InternalServerException_1.default(enrollment_type_1.CourseEnrollmentErrorMessage.UNEXPECTED_SCENARIO);
                }
                if (targetUser.id === course.authorId) {
                    throw new InternalServerException_1.default(enrollment_type_1.CourseEnrollmentErrorMessage.UNEXPECTED_SCENARIO);
                }
                return yield tx.courseEnrollment.update({
                    where: {
                        id: enrollmentId,
                    },
                    data: dto,
                });
            }), {
                maxWait: 5000,
                timeout: 8000,
                isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable,
            });
        });
    }
    deleteEnrollment(enrollmentId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const { userId, courseId } = resourceId;
                const user = yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, userId, new AuthenticationException_1.default());
                const course = yield this.prismaQueryRaw.course.selectForUpdateByIdOrThrow(tx, courseId, new RecordNotFoundException_1.default(course_type_1.CourseErrorMessage.COURSE_DOES_NOT_EXIST));
                const enrollment = yield this.prismaQueryRaw.courseEnrollment.selectForUpdateByIdOrThrow(tx, enrollmentId, new RecordNotFoundException_1.default(enrollment_type_1.CourseEnrollmentErrorMessage.ENROLLMENT_DOES_NOT_EXIST));
                /**
                 * validate relation between resources
                 *
                 */
                if (course.id !== enrollment.courseId) {
                    throw new RecordNotFoundException_1.default(enrollment_type_1.CourseEnrollmentErrorMessage.ENROLLMENT_DOES_NOT_EXIST);
                }
                const { isStudent, isInstructor, isAdmin } = (0, getRoleStatus_1.default)(user.role);
                if (!(isStudent || isInstructor || isAdmin)) {
                    throw new InternalServerException_1.default(enrollment_type_1.CourseEnrollmentErrorMessage.UNEXPECTED_SCENARIO);
                }
                this.authorization.authorizeDeleteEnrollment(user, course, enrollment);
                /**
                 * At this point, user is authorized to update enrollment.
                 *
                 */
                let targetUser = user;
                const isUserIdEqual = userId === enrollment.userId;
                if (!isUserIdEqual) {
                    targetUser =
                        yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, enrollment.userId, new RecordNotFoundException_1.default(enrollment_type_1.CourseEnrollmentErrorMessage.TARGET_USER_DOES_NOT_EXIST));
                }
                /**
                 *
                 * check for unexpected scenario
                 *
                 * 1. target user is STUDENT but enrolled as INSTRUCTOR
                 * 2. target user is author
                 *
                 */
                if ((0, isEqualOrIncludeCourseEnrollmentRole_1.default)(enrollment.role, course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR) &&
                    (0, isEqualOrIncludeRole_1.default)(targetUser.role, course_type_1.UserRoleModel.STUDENT)) {
                    throw new InternalServerException_1.default(enrollment_type_1.CourseEnrollmentErrorMessage.UNEXPECTED_SCENARIO);
                }
                if (targetUser.id === course.authorId) {
                    throw new InternalServerException_1.default(enrollment_type_1.CourseEnrollmentErrorMessage.UNEXPECTED_SCENARIO);
                }
                return yield tx.courseEnrollment.delete({
                    where: {
                        id: enrollmentId,
                    },
                });
            }), {
                maxWait: 5000,
                timeout: 8000,
                isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable,
            });
            return {};
        });
    }
};
__decorate([
    (0, inversify_1.inject)(enrollment_type_1.CourseEnrollmentDITypes.AUTHORIZATION),
    __metadata("design:type", enrollment_authorization_1.default)
], CourseEnrollmentRepository.prototype, "authorization", void 0);
__decorate([
    (0, inversify_1.inject)(prisma_query_raw_type_1.PrismaQueryRawDITypes.PRISMA_QUERY_RAW),
    __metadata("design:type", Object)
], CourseEnrollmentRepository.prototype, "prismaQueryRaw", void 0);
CourseEnrollmentRepository = __decorate([
    (0, inversify_1.injectable)()
], CourseEnrollmentRepository);
exports.default = CourseEnrollmentRepository;
