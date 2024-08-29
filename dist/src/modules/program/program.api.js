"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$DepartmentProgramAPI = void 0;
var $DepartmentProgramAPI;
(function ($DepartmentProgramAPI) {
    const root = "/departments/:departmentId/programs";
    const program = root + "/:programId";
    let CreateProgram;
    (function (CreateProgram) {
        CreateProgram.endpoint = root;
        CreateProgram.generateUrl = (departmentId) => `/departments/${departmentId}/programs`;
    })(CreateProgram = $DepartmentProgramAPI.CreateProgram || ($DepartmentProgramAPI.CreateProgram = {}));
    let GetAllPrograms;
    (function (GetAllPrograms) {
        GetAllPrograms.endpoint = "/programs";
        GetAllPrograms.generateUrl = () => {
            return GetAllPrograms.endpoint;
        };
    })(GetAllPrograms = $DepartmentProgramAPI.GetAllPrograms || ($DepartmentProgramAPI.GetAllPrograms = {}));
    let GetPrograms;
    (function (GetPrograms) {
        GetPrograms.endpoint = root;
        GetPrograms.generateUrl = (departmentId) => `/departments/${departmentId}/programs`;
    })(GetPrograms = $DepartmentProgramAPI.GetPrograms || ($DepartmentProgramAPI.GetPrograms = {}));
    let GetProgramById;
    (function (GetProgramById) {
        GetProgramById.endpoint = program;
        GetProgramById.generateUrl = (departmentId, programId) => `/departments/${departmentId}/programs/${programId}`;
    })(GetProgramById = $DepartmentProgramAPI.GetProgramById || ($DepartmentProgramAPI.GetProgramById = {}));
    let UpdateProgram;
    (function (UpdateProgram) {
        UpdateProgram.endpoint = program;
        UpdateProgram.generateUrl = (departmentId, programId) => `/departments/${departmentId}/programs/${programId}`;
    })(UpdateProgram = $DepartmentProgramAPI.UpdateProgram || ($DepartmentProgramAPI.UpdateProgram = {}));
    let DeleteProgram;
    (function (DeleteProgram) {
        DeleteProgram.endpoint = program;
        DeleteProgram.generateUrl = (departmentId, programId) => `/departments/${departmentId}/programs/${programId}`;
    })(DeleteProgram = $DepartmentProgramAPI.DeleteProgram || ($DepartmentProgramAPI.DeleteProgram = {}));
})($DepartmentProgramAPI || (exports.$DepartmentProgramAPI = $DepartmentProgramAPI = {}));
