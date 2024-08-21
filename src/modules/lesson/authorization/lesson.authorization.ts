import "reflect-metadata";
import { inject, injectable } from "inversify";
import { UserModel } from "../../user/user.type";
import { CourseDITypes } from "../../course/course.type";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import { ICourseLessonAuthorization } from "../lesson.interface";
import { ICourseAuthorization } from "../../course/course.interface";

@injectable()
export default class CourseLessonAuthorization
  extends BaseAuthorization
  implements ICourseLessonAuthorization
{
  @inject(CourseDITypes.AUTHORIZATION)
  private readonly courseAuthorization: ICourseAuthorization;

  public async authorizeCreateLesson(
    user: UserModel,
    courseId: number,
  ): Promise<void> {
    await this.courseAuthorization.authorizeUpdateCourse(user, courseId);
  }

  public async authorizeUpdateLesson(
    user: UserModel,
    courseId: number,
  ): Promise<void> {
    await this.authorizeCreateLesson(user, courseId);
  }

  public async authorizeDeleteLesson(
    user: UserModel,
    courseId: number,
  ): Promise<void> {
    await this.authorizeCreateLesson(user, courseId);
  }
}
