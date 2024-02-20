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
exports.CourseAuthorization = void 0;
require("reflect-metadata");
const AuthorizationException_1 = __importDefault(require("../../../common/class/exceptions/AuthorizationException"));
const getRoleStatus_1 = __importDefault(require("../../../common/functions/getRoleStatus"));
const inversify_1 = require("inversify");
const course_type_1 = require("../course.type");
const BaseAuthorization_1 = __importDefault(require("../../../common/class/BaseAuthorization"));
const isEqualOrIncludeCourseEnrollmentRole_1 = __importDefault(require("../../../common/functions/isEqualOrIncludeCourseEnrollmentRole"));
let CourseAuthorization = class CourseAuthorization extends BaseAuthorization_1.default {
    authorizeCreateCourse(user) {
        const { id: userId, role: userRole } = user;
        const { isStudent, isInstructor, isAdmin } = (0, getRoleStatus_1.default)(userRole);
        let isAuthorized = false;
        if (isStudent) {
        }
        if (isInstructor || isAdmin) {
            isAuthorized = true;
        }
        if (!isAuthorized) {
            throw new AuthorizationException_1.default();
        }
    }
    authorizeUpdateBasicCourse(user, course, enrollment) {
        const { id: userId, role: userRole } = user;
        const { authorId } = course;
        const isAuthor = userId === authorId;
        const { isAdmin, isInstructor, isStudent } = (0, getRoleStatus_1.default)(userRole);
        this.validateUnexpectedScenarios(user, course, enrollment);
        let isAuthorized = false;
        if (isStudent) {
        }
        if (isInstructor) {
            if (isAuthor ||
                (enrollment &&
                    (0, isEqualOrIncludeCourseEnrollmentRole_1.default)(enrollment.role, course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR))) {
                isAuthorized = true;
            }
        }
        if (isAdmin) {
            isAuthorized = true;
        }
        if (!isAuthorized) {
            throw new AuthorizationException_1.default();
        }
    }
    authorizeDeleteCourse(user, course, enrollment) {
        const { id: userId, role: userRole } = user;
        const { authorId } = course;
        const isAuthor = userId === authorId;
        const { isAdmin, isInstructor, isStudent } = (0, getRoleStatus_1.default)(userRole);
        this.validateUnexpectedScenarios(user, course, enrollment);
        let isAuthorized = false;
        if (isStudent) {
        }
        if (isInstructor) {
            if (isAuthor) {
                isAuthorized = true;
            }
        }
        if (isAdmin) {
            isAuthorized = true;
        }
        if (!isAuthorized) {
            throw new AuthorizationException_1.default();
        }
    }
    authorizeCreateLike(user, course, enrollment) {
        const { id: userId, role: userRole } = user;
        const { authorId } = course;
        const isAuthor = userId === authorId;
        const { isAdmin, isInstructor, isStudent } = (0, getRoleStatus_1.default)(userRole);
        this.validateUnexpectedScenarios(user, course, enrollment);
        let isAuthorized = false;
        if (isStudent || isInstructor || isAdmin) {
            if (enrollment &&
                (0, isEqualOrIncludeCourseEnrollmentRole_1.default)(enrollment.role, course_type_1.CourseEnrollmentRoleModel.STUDENT)) {
                isAuthorized = true;
            }
        }
        if (!isAuthorized) {
            throw new AuthorizationException_1.default();
        }
    }
    authorizeDeleteLike(user, course, enrollment) {
        return this.authorizeCreateLike(user, course, enrollment);
    }
};
exports.CourseAuthorization = CourseAuthorization;
exports.CourseAuthorization = CourseAuthorization = __decorate([
    (0, inversify_1.injectable)()
], CourseAuthorization);
