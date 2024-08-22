import { UserModel } from "../../user/user.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import { injectable } from "inversify";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import { IDepartmentProgramAuthorization } from "../program.interface";

@injectable()
export default class DepartmentProgramAuthorization
  extends BaseAuthorization
  implements IDepartmentProgramAuthorization
{
  public async authorizeCreateProgram(
    user: UserModel,
    departmentId: number,
  ): Promise<void> {
    const { isStudent, isAdmin } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent) {
      const department =
        await this.globalRepository.department.getDepartmentByIdOrThrow(
          departmentId,
        );

      if (
        department.leaderId === user.id ||
        department.coLeaderId === user.id
      ) {
        isAuthorized = true;
      }
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public async authorizeUpdateProgram(
    user: UserModel,
    departmentId: number,
  ): Promise<void> {
    await this.authorizeCreateProgram(user, departmentId);
  }

  public async authorizeDeleteProgram(
    user: UserModel,
    departmentId: number,
  ): Promise<void> {
    await this.authorizeCreateProgram(user, departmentId);
  }
}
