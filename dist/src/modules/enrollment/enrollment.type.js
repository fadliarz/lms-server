"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseEnrollmentUrls = exports.CourseEnrollmentDITypes = void 0;
exports.CourseEnrollmentDITypes = {
    REPOSITORY: Symbol.for("COURSE_ENROLLMENT_REPOSITORY"),
    SERVICE: Symbol.for("COURSE_ENROLLMENT_SERVICE"),
    CONTROLLER: Symbol.for("COURSE_ENROLLMENT_CONTROLLER"),
    AUTHORIZATION: Symbol.for("COURSE_ENROLLMENT_AUTHORIZATION"),
};
var courseEnrollmentUrls;
(function (courseEnrollmentUrls) {
    courseEnrollmentUrls["root"] = "/courses/:courseId/enrollments";
    courseEnrollmentUrls["enrollment"] = "/courses/:courseId/enrollments/:enrollmentId";
    courseEnrollmentUrls["role"] = "/courses/:courseId/enrollments/:enrollmentId/role";
})(courseEnrollmentUrls || (exports.courseEnrollmentUrls = courseEnrollmentUrls = {}));
