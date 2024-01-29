import "reflect-metadata";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import { Course, CourseEnrollment, Role, User } from "@prisma/client";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import isEqualOrIncludeCourseEnrollmentRole from "../../../common/functions/isEqualOrIncludeCourseEnrollmentRole";
import { ICourseLessonAuthorization } from "../lesson.type";
import { injectable } from "inversify";

@injectable()
export default class CourseLessonAuthorization
  implements ICourseLessonAuthorization
{
  public authorizeCreateLesson(
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

  public authorizeUpdateLesson(
    user: User,
    course: Course,
    enrollment: CourseEnrollment | null,
  ): void {
    this.authorizeCreateLesson(user, course, enrollment);
  }

  public authorizeDeleteLesson(
    user: User,
    course: Course,
    enrollment: CourseEnrollment | null,
  ): void {
    this.authorizeCreateLesson(user, course, enrollment);
  }
}
