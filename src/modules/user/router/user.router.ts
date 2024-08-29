import "reflect-metadata";
import express from "express";
import dIContainer from "../../../inversifyConfig";
import { UserDITypes } from "../user.type";
import { IUserController } from "../user.interface";
import { $UserAPI } from "../user.api";

export default function UserRouter(authenticationMiddleware: any) {
  const router = express.Router();
  const controller = dIContainer.get<IUserController>(UserDITypes.CONTROLLER);

  /**
   * SignIn
   *
   */

  router.post($UserAPI.SignIn.endpoint, controller.signIn.bind(controller));

  /**
   *
   * SignOut
   *
   */

  router.post(
    $UserAPI.SignOut.endpoint,
    authenticationMiddleware,
    controller.signOut.bind(controller),
  );

  /**
   * Create
   *
   */

  router.post(
    $UserAPI.CreateUser.endpoint,
    controller.createUser.bind(controller),
  );

  /**
   * Get
   *
   */

  router.get(
    $UserAPI.GetPublicUsers.endpoint,
    authenticationMiddleware,
    controller.getPublicUsers.bind(controller),
  );

  router.get(
    $UserAPI.GetUserById.endpoint,
    authenticationMiddleware,
    controller.getUserById.bind(controller),
  );

  router.get(
    $UserAPI.GetMe.endpoint,
    authenticationMiddleware,
    controller.getMe.bind(controller),
  );

  router.get(
    $UserAPI.GetUserPermissions.endpoint,
    authenticationMiddleware,
    controller.getUserPermissions.bind(controller),
  );

  router.get(
    $UserAPI.GetUserAssignments.endpoint,
    authenticationMiddleware,
    controller.getUserAssignments.bind(controller),
  );

  router.get(
    $UserAPI.GetUserEnrolledAsStudentCourses.endpoint,
    authenticationMiddleware,
    controller.getUserEnrolledAsStudentCourses.bind(controller),
  );

  router.get(
    $UserAPI.GetUserManagedCourses.endpoint,
    authenticationMiddleware,
    controller.getUserManagedCourses.bind(controller),
  );

  router.get(
    $UserAPI.GetUserEventAndCourseSchedules.endpoint,
    authenticationMiddleware,
    controller.getUserEventAndCourseSchedules.bind(controller),
  );

  router.get(
    $UserAPI.GetUserEnrolledDepartmentPrograms.endpoint,
    authenticationMiddleware,
    controller.getUserEnrolledDepartmentPrograms.bind(controller),
  );

  router.get(
    $UserAPI.GetUserManagedDepartments.endpoint,
    authenticationMiddleware,
    controller.getUserManagedDepartments.bind(controller),
  );

  router.get(
    $UserAPI.GetUserManagedDepartmentDivisions.endpoint,
    authenticationMiddleware,
    controller.getUserManagedDepartmentDivisions.bind(controller),
  );

  router.get(
    $UserAPI.GetUserReport.endpoint,
    authenticationMiddleware,
    controller.getUserReport.bind(controller),
  );

  /**
   * Update
   *
   */

  router.patch(
    $UserAPI.UpdateBasicUser.endpoint,
    authenticationMiddleware,
    controller.updateBasicUser.bind(controller),
  );

  router.patch(
    $UserAPI.UpdateUserEmail.endpoint,
    authenticationMiddleware,
    controller.updateUserEmail.bind(controller),
  );

  router.patch(
    $UserAPI.UpdateUserPassword.endpoint,
    authenticationMiddleware,
    controller.updateUserPassword.bind(controller),
  );

  router.patch(
    $UserAPI.UpdateUserRole.endpoint,
    authenticationMiddleware,
    controller.updateUserRole.bind(controller),
  );

  router.patch(
    $UserAPI.UpdateUserPhoneNumber.endpoint,
    authenticationMiddleware,
    controller.updateUserPhoneNumber.bind(controller),
  );

  /**
   * Delete
   *
   */

  router.delete(
    $UserAPI.DeleteUser.endpoint,
    authenticationMiddleware,
    controller.deleteUser.bind(controller),
  );

  return router;
}
