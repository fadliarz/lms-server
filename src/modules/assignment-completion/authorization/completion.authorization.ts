import { injectable } from "inversify";
import { ICourseClassAssignmentCompletionAuthorization } from "../completion.interface";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import { UserModel } from "../../user/user.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";

@injectable()
export default class CourseClassAssignmentCompletionAuthorization
  extends BaseAuthorization
  implements ICourseClassAssignmentCompletionAuthorization
{
  public async authorizeCreateCompletion(
    user: UserModel,
    id: { courseId: number; targetUserId: number },
  ): Promise<void> {
    const { isStudent, isInstructor, isAdmin } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent || isInstructor) {
      const enrollment =
        await this.globalRepository.courseEnrollment.getEnrollmentByUserIdAndCourseId(
          {
            userId: id.targetUserId,
            courseId: id.courseId,
          },
        );

      if (enrollment) {
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

  public async authorizeDeleteCompletion(
    user: UserModel,
    completionId: number,
  ): Promise<void> {
    const { isStudent, isInstructor, isAdmin } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent || isInstructor) {
      const completion =
        await this.globalRepository.courseClassAssignmentCompletion.getCompletionById(
          {
            completionId,
          },
        );

      if (completion && completion.userId === user.id) {
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
}
