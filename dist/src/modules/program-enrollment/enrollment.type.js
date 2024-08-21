"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentProgramEnrollmentDITypes = exports.$DepartmentProgramEnrollmentAPI = void 0;
var $DepartmentProgramEnrollmentAPI;
(function ($DepartmentProgramEnrollmentAPI) {
    $DepartmentProgramEnrollmentAPI.root = "/departments/:departmentId/programs/:programId/enrollments";
    $DepartmentProgramEnrollmentAPI.enrollment = $DepartmentProgramEnrollmentAPI.root + "/:enrollmentId";
    let CreateEnrollment;
    (function (CreateEnrollment) {
        CreateEnrollment.endpoint = $DepartmentProgramEnrollmentAPI.root;
        CreateEnrollment.generateUrl = (departmentId, programId) => `/departments/${departmentId}/programs/${programId}/enrollments`;
    })(CreateEnrollment = $DepartmentProgramEnrollmentAPI.CreateEnrollment || ($DepartmentProgramEnrollmentAPI.CreateEnrollment = {}));
    let DeleteEnrollment;
    (function (DeleteEnrollment) {
        DeleteEnrollment.endpoint = $DepartmentProgramEnrollmentAPI.enrollment;
        DeleteEnrollment.generateUrl = (departmentId, divisionId, programId) => `/departments/${departmentId}/programs/${programId}/enrollments`;
    })(DeleteEnrollment = $DepartmentProgramEnrollmentAPI.DeleteEnrollment || ($DepartmentProgramEnrollmentAPI.DeleteEnrollment = {}));
})($DepartmentProgramEnrollmentAPI || (exports.$DepartmentProgramEnrollmentAPI = $DepartmentProgramEnrollmentAPI = {}));
exports.DepartmentProgramEnrollmentDITypes = {
    REPOSITORY: Symbol.for("DEPARTMENT_PROGRAM_ENROLLMENT_REPOSITORY"),
    SERVICE: Symbol.for("DEPARTMENT_PROGRAM_ENROLLMENT_SERVICE"),
    CONTROLLER: Symbol.for("DEPARTMENT_PROGRAM_ENROLLMENT_CONTROLLER"),
    AUTHORIZATION: Symbol.for("DEPARTMENT_PROGRAM_ENROLLMENT_AUTHORIZATION"),
};