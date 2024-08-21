"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentDivisionDITypes = exports.$DepartmentDivisionAPI = void 0;
var $DepartmentDivisionAPI;
(function ($DepartmentDivisionAPI) {
    const root = "/departments/:departmentId/divisions";
    const division = root + "/:divisionId";
    let CreateDivision;
    (function (CreateDivision) {
        CreateDivision.endpoint = root;
        CreateDivision.generateUrl = (departmentId) => `/departments/${departmentId}/divisions`;
    })(CreateDivision = $DepartmentDivisionAPI.CreateDivision || ($DepartmentDivisionAPI.CreateDivision = {}));
    let GetDivisions;
    (function (GetDivisions) {
        GetDivisions.endpoint = root;
        GetDivisions.generateUrl = (departmentId) => `/departments/${departmentId}/divisions`;
    })(GetDivisions = $DepartmentDivisionAPI.GetDivisions || ($DepartmentDivisionAPI.GetDivisions = {}));
    let GetDivisionById;
    (function (GetDivisionById) {
        GetDivisionById.endpoint = division;
        GetDivisionById.generateUrl = (departmentId, divisionId) => `/departments/${departmentId}/divisions/${divisionId}`;
    })(GetDivisionById = $DepartmentDivisionAPI.GetDivisionById || ($DepartmentDivisionAPI.GetDivisionById = {}));
    let UpdateDivision;
    (function (UpdateDivision) {
        UpdateDivision.endpoint = division;
        UpdateDivision.generateUrl = (departmentId, divisionId) => `/departments/${departmentId}/divisions/${divisionId}`;
    })(UpdateDivision = $DepartmentDivisionAPI.UpdateDivision || ($DepartmentDivisionAPI.UpdateDivision = {}));
    let UpdateDivisionLeaderId;
    (function (UpdateDivisionLeaderId) {
        UpdateDivisionLeaderId.endpoint = division + "/leader";
        UpdateDivisionLeaderId.generateUrl = (departmentId, divisionId) => `/departments/${departmentId}/divisions/${divisionId}/leader`;
    })(UpdateDivisionLeaderId = $DepartmentDivisionAPI.UpdateDivisionLeaderId || ($DepartmentDivisionAPI.UpdateDivisionLeaderId = {}));
    let UpdateDivisionCoLeaderId;
    (function (UpdateDivisionCoLeaderId) {
        UpdateDivisionCoLeaderId.endpoint = division + "/co-leader";
        UpdateDivisionCoLeaderId.generateUrl = (departmentId, divisionId) => `/departments/${departmentId}/divisions/${divisionId}/co-leader`;
    })(UpdateDivisionCoLeaderId = $DepartmentDivisionAPI.UpdateDivisionCoLeaderId || ($DepartmentDivisionAPI.UpdateDivisionCoLeaderId = {}));
    let DeleteDivision;
    (function (DeleteDivision) {
        DeleteDivision.endpoint = division;
        DeleteDivision.generateUrl = (departmentId, divisionId) => `/departments/${departmentId}/divisions/${divisionId}`;
    })(DeleteDivision = $DepartmentDivisionAPI.DeleteDivision || ($DepartmentDivisionAPI.DeleteDivision = {}));
})($DepartmentDivisionAPI || (exports.$DepartmentDivisionAPI = $DepartmentDivisionAPI = {}));
exports.DepartmentDivisionDITypes = {
    REPOSITORY: Symbol.for("DEPARTMENT_DIVISION_REPOSITORY"),
    SERVICE: Symbol.for("DEPARTMENT_DIVISION_SERVICE"),
    CONTROLLER: Symbol.for("DEPARTMENT_DIVISION_CONTROLLER"),
    AUTHORIZATION: Symbol.for("DEPARTMENT_DIVISION_AUTHORIZATION"),
};
