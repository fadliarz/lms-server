import { inject, injectable } from "inversify";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import { UserModel } from "../../user/user.type";
import { ICourseClassAuthorization } from "../class.interface";
import { ICourseLessonAuthorization } from "../../lesson/lesson.interface";
import { CourseLessonDITypes } from "../../lesson/lesson.type";

@injectable()
export default class CourseClassAuthorization
  extends BaseAuthorization
  implements ICourseClassAuthorization
{
  @inject(CourseLessonDITypes.AUTHORIZATION)
  private readonly lessonAuthorization: ICourseLessonAuthorization;

  public async authorizeCreateClass(
    user: UserModel,
    courseId: number,
  ): Promise<void> {
    await this.lessonAuthorization.authorizeCreateLesson(user, courseId);
  }

  public async authorizeUpdateClass(
    user: UserModel,
    courseId: number,
  ): Promise<void> {
    await this.authorizeCreateClass(user, courseId);
  }

  public async authorizeDeleteClass(
    user: UserModel,
    courseId: number,
  ): Promise<void> {
    await this.authorizeCreateClass(user, courseId);
  }
}
