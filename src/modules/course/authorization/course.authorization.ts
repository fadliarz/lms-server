import "reflect-metadata";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import { injectable } from "inversify";
import { PrivilegeModel, UserModel } from "../../user/user.type";
import { CourseEnrollmentRoleModel } from "../course.type";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import isEqualOrIncludeCourseEnrollmentRole from "../../../common/functions/isEqualOrIncludeCourseEnrollmentRole";
import { ICourseAuthorization } from "../course.interface";

@injectable()
export default class CourseAuthorization
  extends BaseAuthorization
  implements ICourseAuthorization
{
  public async authorizeCreateCourse(user: UserModel): Promise<void> {
    const { isStudent, isInstructor, isAdmin } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent) {
      isAuthorized = await this.authorizeFromDepartmentDivision(
        user.id,
        PrivilegeModel.COURSE,
      );
    }

    if (isInstructor || isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public async authorizeUpdateCourse(
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

      if (!isAuthorized && isInstructor) {
        const enrollment =
          await this.globalRepository.courseEnrollment.getEnrollmentByUserIdAndCourseId(
            {
              userId: user.id,
              courseId: courseId,
            },
          );
        if (
          enrollment &&
          isEqualOrIncludeCourseEnrollmentRole(
            enrollment.role,
            CourseEnrollmentRoleModel.INSTRUCTOR,
          )
        ) {
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

  public async authorizeDeleteCourse(
    user: UserModel,
    courseId: number,
  ): Promise<void> {
    await this.authorizeUpdateCourse(user, courseId);
  }

  public async authorizeCreateLike(
    user: UserModel,
    courseId: number,
  ): Promise<void> {
    const { isAdmin, isInstructor, isStudent } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent || isInstructor || isAdmin) {
      const enrollment =
        await this.globalRepository.courseEnrollment.getEnrollmentByUserIdAndCourseId(
          {
            userId: user.id,
            courseId: courseId,
          },
        );
      if (
        enrollment &&
        isEqualOrIncludeCourseEnrollmentRole(
          enrollment.role,
          CourseEnrollmentRoleModel.STUDENT,
        )
      ) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public async authorizeDeleteLike(
    user: UserModel,
    courseId: number,
    likeId: number,
  ): Promise<void> {
    const { isAdmin, isInstructor, isStudent } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent || isInstructor || isAdmin) {
      const like = await this.globalRepository.course.getLikeByIdOrThrow({
        likeId,
        resourceId: { courseId },
      });

      if (isAdmin) {
        isAuthorized = true;
      }

      if (like.userId == user.id) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }
}
