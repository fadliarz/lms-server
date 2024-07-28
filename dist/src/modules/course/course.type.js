"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseEnrollmentRoleModel = exports.CourseStatusModel = exports.UserRoleModel = exports.CourseErrorMessage = exports.courseUrls = exports.CourseDITypes = void 0;
exports.CourseDITypes = {
    REPOSITORY: Symbol.for("COURSE_REPOSITORY"),
    SERVICE: Symbol.for("COURSE_SERVICE"),
    CONTROLLER: Symbol.for("COURSE_CONTROLLER"),
    AUTHORIZATION: Symbol.for("COURSE_AUTHORIZATION"),
};
var courseUrls;
(function (courseUrls) {
    courseUrls["root"] = "/courses";
    courseUrls["course"] = "/:courseId";
    courseUrls["basic"] = "/:courseId/basic";
    courseUrls["status"] = "/:courseId/status";
    courseUrls["category"] = "/:courseId/category";
    courseUrls["code"] = "/:courseId/code";
    courseUrls["enrolled"] = "/enrolled";
    courseUrls["likes"] = "/:courseId/likes";
    courseUrls["like"] = "/:courseId/likes/:likeId";
})(courseUrls || (exports.courseUrls = courseUrls = {}));
var CourseErrorMessage;
(function (CourseErrorMessage) {
    CourseErrorMessage["COURSE_DOES_NOT_EXIST"] = "course doesn't exist!";
})(CourseErrorMessage || (exports.CourseErrorMessage = CourseErrorMessage = {}));
/**
 *
 *
 * Model
 *
 *
 */
exports.UserRoleModel = {
    OWNER: "OWNER",
    INSTRUCTOR: "INSTRUCTOR",
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
