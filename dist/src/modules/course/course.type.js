"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseEnrollmentRoleModel = exports.CourseStatusModel = exports.UserRoleModel = exports.CourseDITypes = void 0;
exports.CourseDITypes = {
    REPOSITORY: Symbol.for("COURSE_REPOSITORY"),
    SERVICE: Symbol.for("COURSE_SERVICE"),
    CONTROLLER: Symbol.for("COURSE_CONTROLLER"),
    AUTHORIZATION: Symbol.for("COURSE_AUTHORIZATION"),
};
exports.UserRoleModel = {
    ADMIN: "ADMIN",
    STUDENT: "STUDENT",
};
exports.CourseStatusModel = {
    PUBLISHED: "PUBLISHED",
    DRAFT: "DRAFT",
};
exports.CourseEnrollmentRoleModel = {
    INSTRUCTOR: "INSTRUCTOR",
    STUDENT: "STUDENT",
};
