import { IDepartmentDivisionEnrollmentAuthorization } from "../enrollment.interface";
import { UserModel } from "../../user/user.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import { injectable } from "inversify";
import BaseAuthorization from "../../../common/class/BaseAuthorization";

@injectable()
export default class DepartmentDivisionEnrollmentAuthorization
  extends BaseAuthorization
  implements IDepartmentDivisionEnrollmentAuthorization
{
  public async authorizeCreateEnrollment(
    user: UserModel,
    divisionId: number,
  ): Promise<void> {
    const { isStudent, isInstructor, isAdmin } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent || isInstructor) {
      const division =
        await this.globalRepository.departmentDivision.getDivisionByIdOrThrow(
          divisionId,
        );

      if (division.leaderId === user.id || division.coLeaderId === user.id) {
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

  public async authorizeDeleteEnrollment(
    user: UserModel,
    departmentId: number,
  ): Promise<void> {
    await this.authorizeCreateEnrollment(user, departmentId);
  }
}
