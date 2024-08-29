"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$PersonalAssignmentAPI = void 0;
var $PersonalAssignmentAPI;
(function ($PersonalAssignmentAPI) {
    $PersonalAssignmentAPI.root = "/users/:userId/personal-assignments";
    $PersonalAssignmentAPI.assignment = $PersonalAssignmentAPI.root + "/:assignmentId";
    let CreateAssignment;
    (function (CreateAssignment) {
        CreateAssignment.endpoint = $PersonalAssignmentAPI.root;
        CreateAssignment.generateUrl = (userId) => `/users/${userId}/personal-assignments`;
    })(CreateAssignment = $PersonalAssignmentAPI.CreateAssignment || ($PersonalAssignmentAPI.CreateAssignment = {}));
    let UpdateAssignment;
    (function (UpdateAssignment) {
        UpdateAssignment.endpoint = $PersonalAssignmentAPI.assignment;
        UpdateAssignment.generateUrl = (userId, assignmentId) => `/users/${userId}/personal-assignments/${assignmentId}`;
    })(UpdateAssignment = $PersonalAssignmentAPI.UpdateAssignment || ($PersonalAssignmentAPI.UpdateAssignment = {}));
    let DeleteAssignment;
    (function (DeleteAssignment) {
        DeleteAssignment.endpoint = $PersonalAssignmentAPI.assignment;
        DeleteAssignment.generateUrl = (userId, assignmentId) => `/users/${userId}/personal-assignments/${assignmentId}`;
    })(DeleteAssignment = $PersonalAssignmentAPI.DeleteAssignment || ($PersonalAssignmentAPI.DeleteAssignment = {}));
})($PersonalAssignmentAPI || (exports.$PersonalAssignmentAPI = $PersonalAssignmentAPI = {}));
