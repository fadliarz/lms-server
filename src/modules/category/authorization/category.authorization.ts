import "reflect-metadata";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import { ICourseCategoryAuthorization } from "../category.type";
import { Course, CourseEnrollment, User } from "@prisma/client";
import { injectable } from "inversify";

@injectable()
export default class CourseCategoryAuthorization
  implements ICourseCategoryAuthorization
{
  public authorizeCreateCategory(user: User): void {
    const { id: userId, role: userRole } = user;
    const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);
    let isAuthorized = false;
    if (isStudent) {
    }

    if (isInstructor || isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public authorizeUpdateCategory(user: User): void {
    this.authorizeCreateCategory(user);
  }
}
