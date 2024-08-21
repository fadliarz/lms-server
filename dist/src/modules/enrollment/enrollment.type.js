"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseEnrollmentDITypes = exports.$CourseEnrollmentAPI = void 0;
var $CourseEnrollmentAPI;
(function ($CourseEnrollmentAPI) {
    const root = "/courses/:courseId/enrollments";
    const enrollment = root + "/:enrollmentId";
    let CreateEnrollment;
    (function (CreateEnrollment) {
        CreateEnrollment.endpoint = root;
        CreateEnrollment.generateUrl = (courseId) => `/courses/${courseId}/enrollments`;
    })(CreateEnrollment = $CourseEnrollmentAPI.CreateEnrollment || ($CourseEnrollmentAPI.CreateEnrollment = {}));
    let UpdateEnrollment;
    (function (UpdateEnrollment) {
        UpdateEnrollment.endpoint = enrollment;
        UpdateEnrollment.generateUrl = (courseId, enrollmentId) => `/courses/${courseId}/enrollments/${enrollmentId}`;
    })(UpdateEnrollment = $CourseEnrollmentAPI.UpdateEnrollment || ($CourseEnrollmentAPI.UpdateEnrollment = {}));
    let DeleteEnrollment;
    (function (DeleteEnrollment) {
        DeleteEnrollment.endpoint = enrollment;
        DeleteEnrollment.generateUrl = (courseId, enrollmentId) => `/courses/${courseId}/enrollments/${enrollmentId}`;
    })(DeleteEnrollment = $CourseEnrollmentAPI.DeleteEnrollment || ($CourseEnrollmentAPI.DeleteEnrollment = {}));
})($CourseEnrollmentAPI || (exports.$CourseEnrollmentAPI = $CourseEnrollmentAPI = {}));
exports.CourseEnrollmentDITypes = {
    REPOSITORY: Symbol.for("COURSE_ENROLLMENT_REPOSITORY"),
    SERVICE: Symbol.for("COURSE_ENROLLMENT_SERVICE"),
    CONTROLLER: Symbol.for("COURSE_ENROLLMENT_CONTROLLER"),
    AUTHORIZATION: Symbol.for("COURSE_ENROLLMENT_AUTHORIZATION"),
};
