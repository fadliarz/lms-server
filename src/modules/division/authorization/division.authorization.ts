import { injectable } from "inversify";
import { UserModel } from "../../user/user.type";
import { DepartmentModel } from "../../department/department.type";
import { IDepartmentDivisionAuthorization } from "../division.interface";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import { DepartmentDivisionModel } from "../division.type";

@injectable()
export default class DepartmentDivisionAuthorization
  implements IDepartmentDivisionAuthorization
{
  public authorizeCreateDivision(
    user: UserModel,
    department: DepartmentModel,
  ): void {
    const { id: userId, role } = user;
    const { leaderId, coLeaderId } = department;
    const { isAdmin } = getRoleStatus(role);

    let isAuthorized = false;
    if (isAdmin || userId === leaderId || userId === coLeaderId) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public authorizeUpdateDivision(
    user: UserModel,
    department: DepartmentModel,
    division: DepartmentDivisionModel,
  ): void {
    const { id: userId, role } = user;
    const { isAdmin } = getRoleStatus(role);

    let isAuthorized = false;
    if (
      isAdmin ||
      userId === department.leaderId ||
      userId === department.coLeaderId ||
      userId === division.leaderId ||
      userId === division.coLeaderId
    ) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public authorizeUpdateDivisionLeaderId(
    user: UserModel,
    department: DepartmentModel,
  ): void {
    const { id: userId, role } = user;
    const { isAdmin } = getRoleStatus(role);

    let isAuthorized = false;
    if (
      isAdmin ||
      userId === department.leaderId ||
      userId === department.coLeaderId
    ) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public authorizeUpdateDivisionCoLeaderId(
    user: UserModel,
    department: DepartmentModel,
  ): void {
    this.authorizeUpdateDivisionLeaderId(user, department);
  }

  public authorizeDeleteDivision(
    user: UserModel,
    department: DepartmentModel,
  ): void {
    const { id: userId, role } = user;
    const { isAdmin } = getRoleStatus(role);

    let isAuthorized = false;
    if (
      isAdmin ||
      userId === department.leaderId ||
      userId === department.coLeaderId
    ) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }
}
