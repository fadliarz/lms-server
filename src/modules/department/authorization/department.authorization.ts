import { UserModel } from "../../user/user.type";
import { IDepartmentAuthorization } from "../department.interface";
import { DepartmentModel } from "../department.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import { injectable } from "inversify";

@injectable()
export default class DepartmentAuthorization
  implements IDepartmentAuthorization
{
  public authorizeCreateDepartment(user: UserModel): void {
    const { isAdmin } = getRoleStatus(user.role);
    let isAuthorized = false;

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public authorizeUpdateDepartment(
    user: UserModel,
    department: DepartmentModel,
  ): void {
    const { id: userId } = user;
    const { isAdmin } = getRoleStatus(user.role);
    const { leaderId, coLeaderId } = department;
    let isAuthorized = false;

    if (isAdmin || userId == leaderId || userId == coLeaderId) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public authorizeUpdateDepartmentLeaderId(
    user: UserModel,
    department: DepartmentModel,
  ): void {
    this.authorizeCreateDepartment(user);
  }

  public authorizeUpdateDepartmentCoLeaderId(
    user: UserModel,
    department: DepartmentModel,
  ): void {
    this.authorizeCreateDepartment(user);
  }

  public authorizeDeleteDepartment(user: UserModel): void {
    this.authorizeCreateDepartment(user);
  }
}
