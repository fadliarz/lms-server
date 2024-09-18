import "reflect-metadata";
import { inject, injectable } from "inversify";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import { PrivilegeModel, UserModel } from "../../user/user.type";
import { CourseLessonDITypes } from "../../lesson/lesson.type";
import { ICourseLessonAuthorization } from "../../lesson/lesson.interface";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import { ICourseLessonAttachmentAuthorization } from "../attachment.interface";

@injectable()
export default class CourseLessonAttachmentAuthorization
  extends BaseAuthorization
  implements ICourseLessonAttachmentAuthorization
{
  @inject(CourseLessonDITypes.AUTHORIZATION)
  private readonly lessonAuthorization: ICourseLessonAuthorization;

  public async authorizeCreateAttachment(
    user: UserModel,
    courseId: number,
  ): Promise<void> {
    await this.lessonAuthorization.authorizeUpdateLesson(user, courseId);
  }

  public async authorizeReadAttachment(
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

  public async authorizeUpdateAttachment(
    user: UserModel,
    courseId: number,
  ): Promise<void> {
    await this.lessonAuthorization.authorizeUpdateLesson(user, courseId);
  }

  public async authorizeDeleteAttachment(
    user: UserModel,
    courseId: number,
  ): Promise<void> {
    await this.lessonAuthorization.authorizeUpdateLesson(user, courseId);
  }
}
