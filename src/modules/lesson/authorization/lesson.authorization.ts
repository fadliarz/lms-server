import "reflect-metadata";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import isEqualOrIncludeCourseEnrollmentRole from "../../../common/functions/isEqualOrIncludeCourseEnrollmentRole";
import { ICourseLessonAuthorization } from "../lesson.type";
import { injectable } from "inversify";
import { UserModel } from "../../user/user.type";
import {
  CourseEnrollmentRoleModel,
  CourseModel,
} from "../../course/course.type";
import { CourseEnrollmentModel } from "../../enrollment/enrollment.type";
import BaseAuthorization from "../../../common/class/BaseAuthorization";

@injectable()
export default class CourseLessonAuthorization
  extends BaseAuthorization
  implements ICourseLessonAuthorization
{
  public authorizeCreateLesson(
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ): void {
    const { id: userId, role: userRole } = user;
    const { authorId } = course;
    const isAuthor = userId === authorId;
    const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);

    this.validateUnexpectedScenarios(user, course, enrollment);

    let isAuthorized = false;
    if (isStudent) {
    }

    if (isInstructor) {
      if (
        isAuthor ||
        (enrollment &&
          isEqualOrIncludeCourseEnrollmentRole(
            enrollment.role,
            CourseEnrollmentRoleModel.INSTRUCTOR,
          ))
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

  public authorizeUpdateLesson(
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ): void {
    this.authorizeCreateLesson(user, course, enrollment);
  }

  public authorizeDeleteLesson(
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ): void {
    this.authorizeCreateLesson(user, course, enrollment);
  }
}
