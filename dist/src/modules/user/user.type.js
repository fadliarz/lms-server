"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivilegeModel = exports.UserDITypes = exports.$UserAPI = void 0;
var $UserAPI;
(function ($UserAPI) {
    const root = "/users";
    const user = root + "/:userId";
    let CreateUser;
    (function (CreateUser) {
        CreateUser.endpoint = root;
        CreateUser.generateUrl = () => {
            return root;
        };
    })(CreateUser = $UserAPI.CreateUser || ($UserAPI.CreateUser = {}));
    let GetUserById;
    (function (GetUserById) {
        GetUserById.endpoint = user;
        GetUserById.generateUrl = (userId) => root.concat("/", userId.toString());
    })(GetUserById = $UserAPI.GetUserById || ($UserAPI.GetUserById = {}));
    let GetMe;
    (function (GetMe) {
        GetMe.endpoint = root + "/me";
        GetMe.generateUrl = () => GetMe.endpoint;
    })(GetMe = $UserAPI.GetMe || ($UserAPI.GetMe = {}));
    let GetUserAssignments;
    (function (GetUserAssignments) {
        GetUserAssignments.endpoint = user + "/assignments";
        GetUserAssignments.generateUrl = (userId) => root.concat("/", userId.toString(), "/assignments");
    })(GetUserAssignments = $UserAPI.GetUserAssignments || ($UserAPI.GetUserAssignments = {}));
    let GetUserEnrolledAsStudentCourses;
    (function (GetUserEnrolledAsStudentCourses) {
        GetUserEnrolledAsStudentCourses.endpoint = user + "/enrolled-courses";
        GetUserEnrolledAsStudentCourses.generateUrl = (userId) => `/users/${userId}/enrolled-courses`;
    })(GetUserEnrolledAsStudentCourses = $UserAPI.GetUserEnrolledAsStudentCourses || ($UserAPI.GetUserEnrolledAsStudentCourses = {}));
    let GetUserManagedCourses;
    (function (GetUserManagedCourses) {
        GetUserManagedCourses.endpoint = user + "/managed-courses";
        GetUserManagedCourses.generateUrl = (userId) => `/users/${userId}/managed-courses`;
    })(GetUserManagedCourses = $UserAPI.GetUserManagedCourses || ($UserAPI.GetUserManagedCourses = {}));
    let GetUserEventAndCourseSchedules;
    (function (GetUserEventAndCourseSchedules) {
        GetUserEventAndCourseSchedules.endpoint = user + "/event-and-course-schedules";
        GetUserEventAndCourseSchedules.generateUrl = (userId) => `/users/${userId}/event-and-course-schedules`;
    })(GetUserEventAndCourseSchedules = $UserAPI.GetUserEventAndCourseSchedules || ($UserAPI.GetUserEventAndCourseSchedules = {}));
    let GetUserEnrolledDepartmentPrograms;
    (function (GetUserEnrolledDepartmentPrograms) {
        const attribute = "/enrolled-department-division-programs";
        GetUserEnrolledDepartmentPrograms.endpoint = user + attribute;
        GetUserEnrolledDepartmentPrograms.generateUrl = (userId) => root.concat("/", userId.toString(), attribute);
    })(GetUserEnrolledDepartmentPrograms = $UserAPI.GetUserEnrolledDepartmentPrograms || ($UserAPI.GetUserEnrolledDepartmentPrograms = {}));
    let GetUserManagedDepartments;
    (function (GetUserManagedDepartments) {
        const attribute = "managed-departments";
        GetUserManagedDepartments.endpoint = `${user}/${attribute}`;
        GetUserManagedDepartments.generateUrl = (userId) => `/users/${userId}/${attribute}`;
    })(GetUserManagedDepartments = $UserAPI.GetUserManagedDepartments || ($UserAPI.GetUserManagedDepartments = {}));
    let GetUserManagedDepartmentDivisions;
    (function (GetUserManagedDepartmentDivisions) {
        const attribute = "managed-department-divisions";
        GetUserManagedDepartmentDivisions.endpoint = `${user}/${attribute}`;
        GetUserManagedDepartmentDivisions.generateUrl = (userId) => `/users/${userId}/${attribute}`;
    })(GetUserManagedDepartmentDivisions = $UserAPI.GetUserManagedDepartmentDivisions || ($UserAPI.GetUserManagedDepartmentDivisions = {}));
    let GetUserReport;
    (function (GetUserReport) {
        const attribute = "report";
        GetUserReport.endpoint = `${user}/${attribute}`;
        GetUserReport.generateUrl = (userId) => `/users/${userId}/${attribute}`;
    })(GetUserReport = $UserAPI.GetUserReport || ($UserAPI.GetUserReport = {}));
    let UpdateBasicUser;
    (function (UpdateBasicUser) {
        UpdateBasicUser.endpoint = user + "/basic";
        UpdateBasicUser.generateUrl = (userId) => {
            return root.concat("/", userId.toString(), "/basic");
        };
    })(UpdateBasicUser = $UserAPI.UpdateBasicUser || ($UserAPI.UpdateBasicUser = {}));
    let UpdateUserEmail;
    (function (UpdateUserEmail) {
        UpdateUserEmail.endpoint = user + "/email";
        UpdateUserEmail.generateUrl = (userId) => {
            return root.concat("/", userId.toString(), "/email");
        };
    })(UpdateUserEmail = $UserAPI.UpdateUserEmail || ($UserAPI.UpdateUserEmail = {}));
    let UpdateUserPassword;
    (function (UpdateUserPassword) {
        UpdateUserPassword.endpoint = user + "/password";
        UpdateUserPassword.generateUrl = (userId) => root.concat("/", userId.toString(), "/password");
    })(UpdateUserPassword = $UserAPI.UpdateUserPassword || ($UserAPI.UpdateUserPassword = {}));
    let UpdateUserRole;
    (function (UpdateUserRole) {
        UpdateUserRole.endpoint = user + "/role";
        UpdateUserRole.generateUrl = (userId) => root.concat("/", userId.toString(), "/role");
    })(UpdateUserRole = $UserAPI.UpdateUserRole || ($UserAPI.UpdateUserRole = {}));
    let UpdateUserPhoneNumber;
    (function (UpdateUserPhoneNumber) {
        UpdateUserPhoneNumber.endpoint = user + "/phone";
        UpdateUserPhoneNumber.generateUrl = (userId) => root.concat("/", userId.toString(), "/phone");
    })(UpdateUserPhoneNumber = $UserAPI.UpdateUserPhoneNumber || ($UserAPI.UpdateUserPhoneNumber = {}));
    let DeleteUser;
    (function (DeleteUser) {
        DeleteUser.endpoint = user;
        DeleteUser.generateUrl = (userId) => root.concat("/", userId.toString());
    })(DeleteUser = $UserAPI.DeleteUser || ($UserAPI.DeleteUser = {}));
    let SignIn;
    (function (SignIn) {
        SignIn.endpoint = root + "/signin";
        SignIn.generateUrl = () => SignIn.endpoint;
    })(SignIn = $UserAPI.SignIn || ($UserAPI.SignIn = {}));
    let SignOut;
    (function (SignOut) {
        SignOut.endpoint = root + "/signout";
        SignOut.generateUrl = () => SignOut.endpoint;
    })(SignOut = $UserAPI.SignOut || ($UserAPI.SignOut = {}));
})($UserAPI || (exports.$UserAPI = $UserAPI = {}));
exports.UserDITypes = {
    REPOSITORY: Symbol.for("USER_REPOSITORY"),
    SERVICE: Symbol.for("USER_SERVICE"),
    CONTROLLER: Symbol.for("USER_CONTROLLER"),
    AUTHORIZATION: Symbol.for("USER_AUTHORIZATION"),
};
exports.PrivilegeModel = {
    DEPARTMENT: "DEPARTMENT",
    DIVISION: "DIVISION",
    PROGRAM: "PROGRAM",
    SCHOLARSHIP: "SCHOLARSHIP",
    COMPETITION: "COMPETITION",
    REPORT: "REPORT",
    COURSE: "COURSE",
};
