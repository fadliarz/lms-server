import "reflect-metadata";
import { injectable } from "inversify";
import { Course, CourseEnrollment, Role, User } from "@prisma/client";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import isEqualOrIncludeCourseEnrollmentRole from "../../../common/functions/isEqualOrIncludeCourseEnrollmentRole";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import { ICourseLessonVideoAuthorization } from "../video.type";

@injectable()
export default class CourseLessonVideoAuthorization
  implements ICourseLessonVideoAuthorization
{
  public authorizeCreateVideo(
    user: User,
    course: Course,
    enrollment: CourseEnrollment | null,
  ): void {
    const { id: userId, role: userRole } = user;
    const { authorId } = course;
    const isAuthor = userId === authorId;
    const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);
    let isAuthorized = false;
    if (isStudent) {
    }

    if (isInstructor) {
      if (
        isAuthor ||
        (enrollment &&
          isEqualOrIncludeCourseEnrollmentRole(
            enrollment.role,
            Role.INSTRUCTOR,
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
    user: User,
    course: Course,
    enrollment: CourseEnrollment | null,
  ): void {
    const { id: userId, role: userRole } = user;
    const { authorId } = course;
    const isAuthor = userId === authorId;
    const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);
    let isAuthorized = false;

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

  public authorizeUpdateVideo(
    user: User,
    course: Course,
    enrollment: CourseEnrollment | null,
  ): void {
    this.authorizeCreateVideo(user, course, enrollment);
  }

  public authorizeDeleteVideo(
    user: User,
    course: Course,
    enrollment: CourseEnrollment | null,
  ): void {
    this.authorizeCreateVideo(user, course, enrollment);
  }
}
