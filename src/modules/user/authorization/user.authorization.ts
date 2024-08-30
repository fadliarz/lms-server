import "reflect-metadata";
import { injectable } from "inversify";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import { PrivilegeModel, UserModel } from "../user.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import { IUserAuthorization } from "../user.interface";

@injectable()
export default class UserAuthorization
  extends BaseAuthorization
  implements IUserAuthorization
{
  public authorizeGetUserPermissions(
    user: UserModel,
    targetUserId: number,
  ): void {
    const { isAdmin, isStudent } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent && user.id == targetUserId) {
      isAuthorized = true;
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public authorizeGetUserAssignments(
    user: UserModel,
    targetUserId: number,
  ): void {
    const { isAdmin, isStudent } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent && user.id == targetUserId) {
      isAuthorized = true;
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public authorizeGetUserEnrolledAsStudentCourses(
    user: UserModel,
    targetUserId: number,
  ): void {
    this.authorizeGetUserAssignments(user, targetUserId);
  }

  public async authorizeGetUserManagedCourses(
    user: UserModel,
    targetUserId: number,
  ): Promise<void> {
    const { isAdmin, isStudent } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent && user.id === targetUserId) {
      isAuthorized = true;
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public authorizeGetUserEventAndCourseSchedules(
    user: UserModel,
    targetUserId: number,
  ): void {
    this.authorizeGetUserAssignments(user, targetUserId);
  }

  public async authorizeGetUserEnrolledDepartmentPrograms(
    user: UserModel,
    targetUserId: number,
  ): Promise<void> {
    const { id: userId, role: userRole } = user;
    const { isAdmin, isStudent } = getRoleStatus(userRole);

    let isAuthorized = false;
    if (isStudent) {
      if (userId === targetUserId) {
        isAuthorized = true;
      }

      if (!isAuthorized) {
        isAuthorized =
          await this.globalRepository.user.getUserAuthorizationStatusFromPrivilege(
            { userId: user.id },
            PrivilegeModel.PROGRAM,
          );
      }
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public async authorizeGetUserManagedDepartments(
    user: UserModel,
    targetUserId: number,
  ): Promise<void> {
    const { isStudent, isAdmin } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent && user.id === targetUserId) {
      isAuthorized = true;
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public async authorizeGetUserManagedDepartmentDivisions(
    user: UserModel,
    targetUserId: number,
  ): Promise<void> {
    await this.authorizeGetUserManagedDepartments(user, targetUserId);
  }

  public async authorizeGetUserReport(
    user: UserModel,
    targetUserId: number,
  ): Promise<void> {
    const { id: userId, role: userRole } = user;
    const { isAdmin, isStudent } = getRoleStatus(userRole);

    let isAuthorized = false;
    if (isStudent) {
      if (userId === targetUserId) {
        isAuthorized = true;
      }

      if (!isAuthorized) {
        isAuthorized =
          await this.globalRepository.user.getUserAuthorizationStatusFromPrivilege(
            { userId: user.id },
            PrivilegeModel.REPORT,
          );
      }
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public async authorizeGetUserOrders(
    user: UserModel,
    targetUserId: number,
  ): Promise<void> {
    const { id: userId, role: userRole } = user;
    const { isAdmin, isStudent } = getRoleStatus(userRole);

    let isAuthorized = false;
    if (isStudent) {
      if (userId === targetUserId) {
        isAuthorized = true;
      }

      if (!isAuthorized) {
        isAuthorized =
          await this.globalRepository.user.getUserAuthorizationStatusFromPrivilege(
            { userId: user.id },
            PrivilegeModel.STORE,
          );
      }
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public async authorizeGetDepartmentProgramsWithEnrollmentInformation(
    user: UserModel,
    targetUserId: number,
  ): Promise<void> {
    const { id: userId, role: userRole } = user;
    const { isAdmin, isStudent } = getRoleStatus(userRole);

    let isAuthorized = false;
    if (isStudent) {
      if (userId === targetUserId) {
        isAuthorized = true;
      }

      if (!isAuthorized) {
        isAuthorized =
          await this.globalRepository.user.getUserAuthorizationStatusFromPrivilege(
            { userId: user.id },
            PrivilegeModel.PROGRAM,
          );
      }
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public authorizeUpdateUser(user: UserModel, targetUserId: number): void {
    const { id: userId, role: userRole } = user;
    const { isAdmin, isStudent } = getRoleStatus(userRole);

    let isAuthorized = false;
    if (isStudent && userId === targetUserId) {
      isAuthorized = true;
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public authorizeDeleteUser(user: UserModel, targetUserId: number): void {
    this.authorizeUpdateUser(user, targetUserId);
  }
}
