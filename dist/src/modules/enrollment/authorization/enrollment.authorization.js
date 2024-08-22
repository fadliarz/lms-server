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
const course_type_1 = require("../../course/course.type");
const AuthorizationException_1 = __importDefault(require("../../../common/class/exceptions/AuthorizationException"));
const inversify_1 = require("inversify");
const isEqualOrIncludeCourseEnrollmentRole_1 = __importDefault(require("../../../common/functions/isEqualOrIncludeCourseEnrollmentRole"));
let CourseEnrollmentAuthorization = class CourseEnrollmentAuthorization {
    authorizeCreateEnrollment(user, dto) {
        const { isAdmin, isStudent } = (0, getRoleStatus_1.default)(user.role);
        let isAuthorized = false;
        if (isStudent) {
            if (user.id == dto.userId &&
                (0, isEqualOrIncludeCourseEnrollmentRole_1.default)(dto.role, [
                    course_type_1.CourseEnrollmentRoleModel.STUDENT,
                ])) {
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
    authorizeUpdateEnrollmentRole(user) {
        const { isAdmin, isStudent } = (0, getRoleStatus_1.default)(user.role);
        let isAuthorized = false;
        if (isStudent) {
        }
        if (isAdmin) {
            isAuthorized = true;
        }
        if (!isAuthorized) {
            throw new AuthorizationException_1.default();
        }
    }
    authorizeDeleteEnrollment(user, enrollment) {
        const { isAdmin, isStudent } = (0, getRoleStatus_1.default)(user.role);
        let isAuthorized = false;
        if (isStudent && user.id == enrollment.userId) {
            isAuthorized = true;
        }
        if (isAdmin) {
            isAuthorized = true;
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
