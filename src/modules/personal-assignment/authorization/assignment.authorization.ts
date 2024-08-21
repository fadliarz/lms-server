import { IPersonalAssignmentAuthorization } from "../assignment.interface";
import { injectable } from "inversify";
import { UserModel } from "../../user/user.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import BaseAuthorization from "../../../common/class/BaseAuthorization";

@injectable()
export default class PersonalAssignmentAuthorization
  extends BaseAuthorization
  implements IPersonalAssignmentAuthorization
{
  public authorizeCreateAssignment(
    user: UserModel,
    targetUserId: number,
  ): void {
    const { isStudent, isInstructor, isAdmin } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent || isInstructor) {
      if (user.id === targetUserId) {
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

  public async authorizeUpdateAssignment(
    user: UserModel,
    assignmentId: number,
  ): Promise<void> {
    const { isStudent, isInstructor, isAdmin } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent || isInstructor) {
      const assignment =
        await this.globalRepository.personalAssignment.getAssignmentByIdOrThrow(
          {
            assignmentId,
          },
        );

      if (user.id === assignment.userId) {
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

  public async authorizeDeleteAssignment(
    user: UserModel,
    assignmentId: number,
  ): Promise<void> {
    await this.authorizeUpdateAssignment(user, assignmentId);
  }
}
