"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseEnrollmentErrorMessage = exports.courseEnrollmentUrls = exports.CourseEnrollmentDITypes = void 0;
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
var CourseEnrollmentErrorMessage;
(function (CourseEnrollmentErrorMessage) {
    CourseEnrollmentErrorMessage["ENROLLMENT_DOES_NOT_EXIST"] = "enrollment doesn't exist!";
    CourseEnrollmentErrorMessage["UNEXPECTED_SCENARIO"] = "unexpected scenario, please submit a ticket!";
    CourseEnrollmentErrorMessage["STUDENT_SHOULD_NOT_ENROLLED_AS_INSTRUCTOR"] = "user with role STUDENT can't be enrolled as INSTRUCTOR on a course!";
    CourseEnrollmentErrorMessage["AUTHOR_SHOULD_NOT_BE_ENROLLED"] = "author should not be enrolled!";
    CourseEnrollmentErrorMessage["TARGET_USER_DOES_NOT_EXIST"] = "target user doesn't exist!";
    CourseEnrollmentErrorMessage["TARGET_USER_IS_ALREADY_ENROLLED"] = "target user is already enrolled!";
})(CourseEnrollmentErrorMessage || (exports.CourseEnrollmentErrorMessage = CourseEnrollmentErrorMessage = {}));
