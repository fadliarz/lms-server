"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const user_type_1 = require("../user.type");
const user_api_1 = require("../user.api");
function UserRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(user_type_1.UserDITypes.CONTROLLER);
    /**
     * SignIn
     *
     */
    router.post(user_api_1.$UserAPI.SignIn.endpoint, controller.signIn.bind(controller));
    /**
     *
     * SignOut
     *
     */
    router.post(user_api_1.$UserAPI.SignOut.endpoint, authenticationMiddleware, controller.signOut.bind(controller));
    /**
     * Create
     *
     */
    router.post(user_api_1.$UserAPI.CreateUser.endpoint, controller.createUser.bind(controller));
    /**
     * Get
     *
     */
    router.get(user_api_1.$UserAPI.GetPublicUsers.endpoint, authenticationMiddleware, controller.getPublicUsers.bind(controller));
    router.get(user_api_1.$UserAPI.GetUserById.endpoint, authenticationMiddleware, controller.getUserById.bind(controller));
    router.get(user_api_1.$UserAPI.GetMe.endpoint, authenticationMiddleware, controller.getMe.bind(controller));
    router.get(user_api_1.$UserAPI.GetUserPermissions.endpoint, authenticationMiddleware, controller.getUserPermissions.bind(controller));
    router.get(user_api_1.$UserAPI.GetUserAssignments.endpoint, authenticationMiddleware, controller.getUserAssignments.bind(controller));
    router.get(user_api_1.$UserAPI.GetUserEnrolledAsStudentCourses.endpoint, authenticationMiddleware, controller.getUserEnrolledAsStudentCourses.bind(controller));
    router.get(user_api_1.$UserAPI.GetUserManagedCourses.endpoint, authenticationMiddleware, controller.getUserManagedCourses.bind(controller));
    router.get(user_api_1.$UserAPI.GetUserEventAndCourseSchedules.endpoint, authenticationMiddleware, controller.getUserEventAndCourseSchedules.bind(controller));
    router.get(user_api_1.$UserAPI.GetUserEnrolledDepartmentPrograms.endpoint, authenticationMiddleware, controller.getUserEnrolledDepartmentPrograms.bind(controller));
    router.get(user_api_1.$UserAPI.GetUserManagedDepartments.endpoint, authenticationMiddleware, controller.getUserManagedDepartments.bind(controller));
    router.get(user_api_1.$UserAPI.GetUserManagedDepartmentDivisions.endpoint, authenticationMiddleware, controller.getUserManagedDepartmentDivisions.bind(controller));
    router.get(user_api_1.$UserAPI.GetUserReport.endpoint, authenticationMiddleware, controller.getUserReport.bind(controller));
    router.get(user_api_1.$UserAPI.GetUserOrders.endpoint, authenticationMiddleware, controller.getUserOrders.bind(controller));
    router.get(user_api_1.$UserAPI.GetDepartmentProgramsWithEnrollmentInformation.endpoint, authenticationMiddleware, controller.getDepartmentProgramsWithEnrollmentInformation.bind(controller));
    /**
     * Update
     *
     */
    router.patch(user_api_1.$UserAPI.UpdateBasicUser.endpoint, authenticationMiddleware, controller.updateBasicUser.bind(controller));
    router.patch(user_api_1.$UserAPI.UpdateUserEmail.endpoint, authenticationMiddleware, controller.updateUserEmail.bind(controller));
    router.patch(user_api_1.$UserAPI.UpdateUserPassword.endpoint, authenticationMiddleware, controller.updateUserPassword.bind(controller));
    router.patch(user_api_1.$UserAPI.UpdateUserRole.endpoint, authenticationMiddleware, controller.updateUserRole.bind(controller));
    router.patch(user_api_1.$UserAPI.UpdateUserPhoneNumber.endpoint, authenticationMiddleware, controller.updateUserPhoneNumber.bind(controller));
    /**
     * Delete
     *
     */
    router.delete(user_api_1.$UserAPI.DeleteUser.endpoint, authenticationMiddleware, controller.deleteUser.bind(controller));
    return router;
}
exports.default = UserRouter;
