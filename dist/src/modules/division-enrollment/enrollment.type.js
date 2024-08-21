"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentDivisionEnrollmentDITypes = exports.$DepartmentDivisionEnrollmentAPI = void 0;
var $DepartmentDivisionEnrollmentAPI;
(function ($DepartmentDivisionEnrollmentAPI) {
    const root = "/departments/:departmentId/divisions/:divisionId/enrollments";
    const enrollment = root + "/:enrollmentId";
    let CreateEnrollment;
    (function (CreateEnrollment) {
        CreateEnrollment.endpoint = root;
        CreateEnrollment.generateUrl = (departmentId, divisionId) => `/departments/${departmentId}/divisions/${divisionId}/enrollments`;
    })(CreateEnrollment = $DepartmentDivisionEnrollmentAPI.CreateEnrollment || ($DepartmentDivisionEnrollmentAPI.CreateEnrollment = {}));
    let GetEnrollments;
    (function (GetEnrollments) {
        GetEnrollments.endpoint = root;
        GetEnrollments.generateUrl = (departmentId, divisionId) => `/departments/${departmentId}/divisions/${divisionId}/enrollments`;
    })(GetEnrollments = $DepartmentDivisionEnrollmentAPI.GetEnrollments || ($DepartmentDivisionEnrollmentAPI.GetEnrollments = {}));
    let DeleteEnrollment;
    (function (DeleteEnrollment) {
        DeleteEnrollment.endpoint = enrollment;
        DeleteEnrollment.generateUrl = (departmentId, divisionId, enrollmentId) => `/departments/${departmentId}/divisions/${divisionId}/enrollments/${enrollmentId}`;
    })(DeleteEnrollment = $DepartmentDivisionEnrollmentAPI.DeleteEnrollment || ($DepartmentDivisionEnrollmentAPI.DeleteEnrollment = {}));
})($DepartmentDivisionEnrollmentAPI || (exports.$DepartmentDivisionEnrollmentAPI = $DepartmentDivisionEnrollmentAPI = {}));
exports.DepartmentDivisionEnrollmentDITypes = {
    REPOSITORY: Symbol.for("DEPARTMENT_DIVISION_ENROLLMENT_REPOSITORY"),
    SERVICE: Symbol.for("DEPARTMENT_DIVISION_ENROLLMENT_SERVICE"),
    CONTROLLER: Symbol.for("DEPARTMENT_DIVISION_ENROLLMENT_CONTROLLER"),
    AUTHORIZATION: Symbol.for("DEPARTMENT_DIVISION_ENROLLMENT_AUTHORIZATION"),
};
