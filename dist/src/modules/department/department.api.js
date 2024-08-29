"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$DepartmentAPI = void 0;
var $DepartmentAPI;
(function ($DepartmentAPI) {
    const root = "/departments";
    const department = root + ":/departmentId";
    let CreateDepartment;
    (function (CreateDepartment) {
        CreateDepartment.endpoint = root;
        CreateDepartment.generateUrl = () => CreateDepartment.endpoint;
    })(CreateDepartment = $DepartmentAPI.CreateDepartment || ($DepartmentAPI.CreateDepartment = {}));
    let GetDepartments;
    (function (GetDepartments) {
        GetDepartments.endpoint = root;
        GetDepartments.generateUrl = () => GetDepartments.endpoint;
    })(GetDepartments = $DepartmentAPI.GetDepartments || ($DepartmentAPI.GetDepartments = {}));
    let GetDepartmentById;
    (function (GetDepartmentById) {
        GetDepartmentById.endpoint = department;
        GetDepartmentById.generateUrl = (departmentId) => `/departments/${departmentId}`;
    })(GetDepartmentById = $DepartmentAPI.GetDepartmentById || ($DepartmentAPI.GetDepartmentById = {}));
    let UpdateDepartment;
    (function (UpdateDepartment) {
        UpdateDepartment.endpoint = department;
        UpdateDepartment.generateUrl = (departmentId) => `/departments/${departmentId}`;
    })(UpdateDepartment = $DepartmentAPI.UpdateDepartment || ($DepartmentAPI.UpdateDepartment = {}));
    let UpdateDepartmentLeaderId;
    (function (UpdateDepartmentLeaderId) {
        UpdateDepartmentLeaderId.endpoint = department + "/leader";
        UpdateDepartmentLeaderId.generateUrl = (departmentId) => `/departments/${departmentId}/leader`;
    })(UpdateDepartmentLeaderId = $DepartmentAPI.UpdateDepartmentLeaderId || ($DepartmentAPI.UpdateDepartmentLeaderId = {}));
    let UpdateDepartmentCoLeaderId;
    (function (UpdateDepartmentCoLeaderId) {
        UpdateDepartmentCoLeaderId.endpoint = department + "/co-leader";
        UpdateDepartmentCoLeaderId.generateUrl = (departmentId) => `/departments/${departmentId}/co-leader`;
    })(UpdateDepartmentCoLeaderId = $DepartmentAPI.UpdateDepartmentCoLeaderId || ($DepartmentAPI.UpdateDepartmentCoLeaderId = {}));
    let DeleteDepartment;
    (function (DeleteDepartment) {
        DeleteDepartment.endpoint = department;
        DeleteDepartment.generateUrl = (departmentId) => `/departments/${departmentId}`;
    })(DeleteDepartment = $DepartmentAPI.DeleteDepartment || ($DepartmentAPI.DeleteDepartment = {}));
})($DepartmentAPI || (exports.$DepartmentAPI = $DepartmentAPI = {}));
