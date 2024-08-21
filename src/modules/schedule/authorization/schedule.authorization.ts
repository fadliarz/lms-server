import { inject, injectable } from "inversify";
import { ICourseScheduleAuthorization } from "../schedule.interface";
import { UserModel } from "../../user/user.type";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import { CourseClassAssignmentDITypes } from "../../assignment/assignment.type";
import { ICourseClassAssignmentAuthorization } from "../../assignment/assignment.interface";

@injectable()
export default class CourseScheduleAuthorization
  extends BaseAuthorization
  implements ICourseScheduleAuthorization
{
  @inject(CourseClassAssignmentDITypes.AUTHORIZATION)
  private readonly assignmentAuthorization: ICourseClassAssignmentAuthorization;

  public async authorizeCreateSchedule(
    user: UserModel,
    courseId: number,
  ): Promise<void> {
    await this.assignmentAuthorization.authorizeCreateAssignment(
      user,
      courseId,
    );
  }

  public async authorizeReadSchedule(
    user: UserModel,
    courseId: number,
  ): Promise<void> {
    await this.assignmentAuthorization.authorizeReadAssignment(user, courseId);
  }

  public async authorizeUpdateSchedule(
    user: UserModel,
    courseId: number,
  ): Promise<void> {
    await this.authorizeCreateSchedule(user, courseId);
  }

  public async authorizeDeleteSchedule(
    user: UserModel,
    courseId: number,
  ): Promise<void> {
    await this.authorizeCreateSchedule(user, courseId);
  }
}
