import "reflect-metadata";
import { injectable } from "inversify";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import isEqualOrIncludeCourseEnrollmentRole from "../../../common/functions/isEqualOrIncludeCourseEnrollmentRole";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import { ICourseLessonVideoAuthorization } from "../video.type";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import { UserModel } from "../../user/user.type";
import { CourseModel, UserRoleModel } from "../../course/course.type";
import { CourseEnrollmentModel } from "../../enrollment/enrollment.type";

@injectable()
export default class CourseLessonVideoAuthorization
  extends BaseAuthorization
  implements ICourseLessonVideoAuthorization
{
  public authorizeCreateVideo(
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ): void {
    const { id: userId, role: userRole } = user;
    const { authorId } = course;
    const isAuthor = userId === authorId;
    const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);
    let isAuthorized = false;

    this.validateUnexpectedScenarios(user, course, enrollment);

    if (isStudent) {
    }

    if (isInstructor) {
      if (
        isAuthor ||
        (enrollment &&
          isEqualOrIncludeCourseEnrollmentRole(
            enrollment.role,
            UserRoleModel.INSTRUCTOR,
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

  public authorizeGetVideo(
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ): void {
    const { id: userId, role: userRole } = user;
    const { authorId } = course;
    const isAuthor = userId === authorId;
    const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);
    let isAuthorized = false;

    this.validateUnexpectedScenarios(user, course, enrollment);

    if (isStudent || isInstructor) {
      if (isAuthor || enrollment) {
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

  public authorizeGetVideos(
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ): void {
    this.authorizeGetVideo(user, course, enrollment);
  }

  public authorizeUpdateVideo(
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ): void {
    this.authorizeCreateVideo(user, course, enrollment);
  }

  public authorizeDeleteVideo(
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ): void {
    this.authorizeCreateVideo(user, course, enrollment);
  }
}
