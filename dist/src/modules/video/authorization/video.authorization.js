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
require("reflect-metadata");
const inversify_1 = require("inversify");
const getRoleStatus_1 = __importDefault(require("../../../common/functions/getRoleStatus"));
const isEqualOrIncludeCourseEnrollmentRole_1 = __importDefault(require("../../../common/functions/isEqualOrIncludeCourseEnrollmentRole"));
const AuthorizationException_1 = __importDefault(require("../../../common/class/exceptions/AuthorizationException"));
const BaseAuthorization_1 = __importDefault(require("../../../common/class/BaseAuthorization"));
const course_type_1 = require("../../course/course.type");
let CourseLessonVideoAuthorization = class CourseLessonVideoAuthorization extends BaseAuthorization_1.default {
    authorizeCreateVideo(user, course, enrollment) {
        const { id: userId, role: userRole } = user;
        const { authorId } = course;
        const isAuthor = userId === authorId;
        const { isAdmin, isInstructor, isStudent } = (0, getRoleStatus_1.default)(userRole);
        let isAuthorized = false;
        this.validateUnexpectedScenarios(user, course, enrollment);
        if (isStudent) {
        }
        if (isInstructor) {
            if (isAuthor ||
                (enrollment &&
                    (0, isEqualOrIncludeCourseEnrollmentRole_1.default)(enrollment.role, course_type_1.UserRoleModel.INSTRUCTOR))) {
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
    authorizeGetVideo(user, course, enrollment) {
        const { id: userId, role: userRole } = user;
        const { authorId } = course;
        const isAuthor = userId === authorId;
        const { isAdmin, isInstructor, isStudent } = (0, getRoleStatus_1.default)(userRole);
        let isAuthorized = false;
        this.validateUnexpectedScenarios(user, course, enrollment);
        if (isStudent || isInstructor) {
            if (isAuthor || enrollment) {
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
    authorizeGetVideos(user, course, enrollment) {
        this.authorizeGetVideo(user, course, enrollment);
    }
    authorizeUpdateVideo(user, course, enrollment) {
        this.authorizeCreateVideo(user, course, enrollment);
    }
    authorizeDeleteVideo(user, course, enrollment) {
        this.authorizeCreateVideo(user, course, enrollment);
    }
};
CourseLessonVideoAuthorization = __decorate([
    (0, inversify_1.injectable)()
], CourseLessonVideoAuthorization);
exports.default = CourseLessonVideoAuthorization;
