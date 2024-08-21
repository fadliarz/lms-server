import "reflect-metadata";
import { inject, injectable } from "inversify";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import { PrivilegeModel, UserModel } from "../../user/user.type";
import { ICourseLessonVideoAuthorization } from "../video.interface";
import { CourseLessonDITypes } from "../../lesson/lesson.type";
import { ICourseLessonAuthorization } from "../../lesson/lesson.interface";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";

@injectable()
export default class CourseLessonVideoAuthorization
  extends BaseAuthorization
  implements ICourseLessonVideoAuthorization
{
  @inject(CourseLessonDITypes.AUTHORIZATION)
  private readonly lessonAuthorization: ICourseLessonAuthorization;

  public async authorizeCreateVideo(
    user: UserModel,
    courseId: number,
  ): Promise<void> {
    await this.lessonAuthorization.authorizeUpdateLesson(user, courseId);
  }

  public async authorizeReadVideo(
    user: UserModel,
    courseId: number,
  ): Promise<void> {
    const { isAdmin, isInstructor, isStudent } = getRoleStatus(user.role);
    const isAuthor = await this.isAuthor(user.id, courseId);

    let isAuthorized = false;
    if (isStudent || isInstructor) {
      if (isAuthor) {
        isAuthorized = true;
      }

      if (!isAuthorized) {
        isAuthorized = await this.authorizeFromDepartmentDivision(
          user.id,
          PrivilegeModel.COURSE,
        );
      }

      if (!isAuthorized) {
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
      }
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public async authorizeUpdateVideo(
    user: UserModel,
    courseId: number,
  ): Promise<void> {
    await this.lessonAuthorization.authorizeUpdateLesson(user, courseId);
  }

  public async authorizeDeleteVideo(
    user: UserModel,
    courseId: number,
  ): Promise<void> {
    await this.lessonAuthorization.authorizeUpdateLesson(user, courseId);
  }
}
