"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getRoleStatus_1 = __importDefault(require("../../../common/functions/getRoleStatus"));
const isEqualOrIncludeRole_1 = __importDefault(require("../../../common/functions/isEqualOrIncludeRole"));
const course_type_1 = require("../../course/course.type");
const AuthorizationException_1 = __importDefault(require("../../../common/class/exceptions/AuthorizationException"));
const client_1 = require("@prisma/client");
const inversify_1 = require("inversify");
const isEqualOrIncludeCourseEnrollmentRole_1 = __importDefault(require("../../../common/functions/isEqualOrIncludeCourseEnrollmentRole"));
const InternalServerException_1 = __importDefault(require("../../../common/class/exceptions/InternalServerException"));
let CourseEnrollmentAuthorization = class CourseEnrollmentAuthorization {
    authorizeCreateEnrollment(user, course, dto) {
        const { id: userId, role: userRole } = user;
        const { authorId } = course;
        const isUserIdEqual = userId === dto.userId;
        const isAuthor = userId === authorId;
        const { isAdmin, isInstructor, isStudent } = (0, getRoleStatus_1.default)(userRole);
        let isAuthorized = false;
        if (isStudent) {
            if (isAuthor) {
                throw new InternalServerException_1.default();
            }
            if (isUserIdEqual &&
                (0, isEqualOrIncludeRole_1.default)(dto.role, [course_type_1.UserRoleModel.STUDENT])) {
                isAuthorized = true;
            }
        }
        if (isInstructor) {
            if (isUserIdEqual &&
                !isAuthor &&
                (0, isEqualOrIncludeCourseEnrollmentRole_1.default)(dto.role, [
                    client_1.CourseEnrollmentRole.STUDENT,
                ])) {
                isAuthorized = true;
            }
        }
        if (isAdmin) {
            if (!(isUserIdEqual && isAuthor)) {
                isAuthorized = true;
            }
        }
        if (!isAuthorized) {
            throw new AuthorizationException_1.default();
        }
    }
    authorizeUpdateEnrollmentRole(user, course, enrollment) {
        const { id: userId, role: userRole } = user;
        const { userId: targetUserId } = enrollment;
        const { authorId } = course;
        const isUserIdEqual = userId === targetUserId;
        const isAuthor = userId === authorId;
        const { isAdmin, isInstructor, isStudent } = (0, getRoleStatus_1.default)(userRole);
        let isAuthorized = false;
        if (course.authorId === enrollment.userId) {
            throw new InternalServerException_1.default();
        }
        if (isStudent) {
            if (isAuthor) {
                throw new InternalServerException_1.default();
            }
        }
        if (isInstructor) {
            if (!isUserIdEqual && isAuthor) {
                isAuthorized = true;
            }
        }
        if (isAdmin) {
            if (!(isUserIdEqual && isAuthor)) {
                isAuthorized = true;
            }
        }
        if (!isAuthorized) {
            throw new AuthorizationException_1.default();
        }
    }
    authorizeDeleteEnrollment(user, course, enrollment) {
        const { id: userId, role: userRole } = user;
        const { userId: targetUserId } = enrollment;
        const { authorId } = course;
        const isUserIdEqual = userId === targetUserId;
        const isAuthor = userId === authorId;
        const { isAdmin, isInstructor, isStudent } = (0, getRoleStatus_1.default)(userRole);
        let isAuthorized = false;
        if (course.authorId === enrollment.userId) {
            throw new InternalServerException_1.default();
        }
        if (isStudent) {
            if (isAuthor) {
                throw new InternalServerException_1.default();
            }
            if (isUserIdEqual) {
                isAuthorized = true;
            }
        }
        if (isInstructor) {
            if ((isUserIdEqual && !isAuthor) || (!isUserIdEqual && isAuthor)) {
                isAuthorized = true;
            }
        }
        if (isAdmin) {
            if (!(isUserIdEqual && isAuthor)) {
                isAuthorized = true;
            }
        }
        if (!isAuthorized) {
            throw new AuthorizationException_1.default();
        }
    }
};
CourseEnrollmentAuthorization = __decorate([
    (0, inversify_1.injectable)()
], CourseEnrollmentAuthorization);
exports.default = CourseEnrollmentAuthorization;
