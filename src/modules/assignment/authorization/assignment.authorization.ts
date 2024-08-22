import { inject, injectable } from "inversify";
import { ICourseClassAssignmentAuthorization } from "../assignment.interface";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import { PrivilegeModel, UserModel } from "../../user/user.type";
import { ICourseLessonAuthorization } from "../../lesson/lesson.interface";
import { CourseLessonDITypes } from "../../lesson/lesson.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";

@injectable()
export default class CourseClassAssignmentAuthorization
  extends BaseAuthorization
  implements ICourseClassAssignmentAuthorization
{
  @inject(CourseLessonDITypes.AUTHORIZATION)
  private readonly lessonAuthorization: ICourseLessonAuthorization;

  public async authorizeCreateAssignment(
    user: UserModel,
    courseId: number,
  ): Promise<void> {
    await this.lessonAuthorization.authorizeCreateLesson(user, courseId);
  }

  public async authorizeReadAssignment(
    user: UserModel,
    courseId: number,
  ): Promise<void> {
    const { isAdmin, isStudent } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent) {
      const enrollment =
        await this.globalRepository.courseEnrollment.getEnrollmentByUserIdAndCourseId(
          {
            userId: user.id,
            courseId: courseId,
          },
        );
      if (enrollment) {
        isAuthorized = true;
      }

      if (!isAuthorized) {
        isAuthorized = await this.authorizeFromDepartmentDivision(
          user.id,
          PrivilegeModel.COURSE,
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

  public async authorizeUpdateAssignment(
    user: UserModel,
    courseId: number,
  ): Promise<void> {
    await this.authorizeCreateAssignment(user, courseId);
  }

  public async authorizeDeleteAssignment(
    user: UserModel,
    courseId: number,
  ): Promise<void> {
    await this.authorizeCreateAssignment(user, courseId);
  }
}
