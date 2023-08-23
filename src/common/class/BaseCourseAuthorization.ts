import AuthorizationMiddleware from "./AuthorizationMiddleware";
import RecordNotFoundException from "../exceptions/RecordNotFoundException";
import HttpException from "../exceptions/HttpException";
import { StatusCode } from "../constants/statusCode";
import { injectable } from "inversify";
import { CourseEnrollment } from "@prisma/client";

@injectable()
export class BaseCourseAuthorization extends AuthorizationMiddleware {
  protected async getAuthorIdOrThrow(
    courseId: number,
    errorObject?: Error
  ): Promise<number> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: {
        authorId: true,
      },
    });

    if (!course) {
      throw errorObject || new RecordNotFoundException("Course not found!");
    }

    return course.authorId;
  }

  protected async getEnrollmentRole(
    userId: number,
    courseId: number
  ): Promise<Pick<CourseEnrollment, "role"> | null> {
    const enrollment = await this.prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      select: {
        role: true,
      },
    });

    return enrollment;
  }

  protected async getEnrollmentRoleOrThrow(
    userId: number,
    courseId: number,
    error?: Error
  ): Promise<Pick<CourseEnrollment, "role">> {
    const enrollment = await this.getEnrollmentRole(userId, courseId);

    if (!enrollment) {
      throw error || new RecordNotFoundException();
    }

    return enrollment;
  }

  protected async isNotEnrolledOrThrow(
    userId: number,
    courseId: number
  ): Promise<void> {
    const userEnrollment = await this.prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: courseId,
        },
      },
      select: {
        id: true,
      },
    });

    if (userEnrollment) {
      throw new HttpException(
        StatusCode.BAD_REQUEST,
        "User is already enrolled to the course!"
      );
    }
  }
}
