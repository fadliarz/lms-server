import { AuthorizationMiddleware } from "./AuthorizationMiddleware";
import { RecordNotFoundException } from "../exceptions/RecordNotFoundException";
import dIContainer from "../../inversifyConfig";
import { PrismaClient, Role } from "@prisma/client";
import { databaseDITypes } from "../constants/databaseDITypes";
import HttpException from "../exceptions/HttpException";
import { StatusCode } from "../constants/statusCode";
import { CourseEnrollmentSelect } from "../../modules/course/course.type";
import { CourseEnrollmentModel } from "../../modules/enrollment/enrollment.type";

export class BaseCourseAuthorization extends AuthorizationMiddleware {
  protected readonly prisma = dIContainer.get<PrismaClient>(
    databaseDITypes.PRISMA_CLIENT
  );

  protected async getCourseOwnerUserIdOrThrow(
    courseId: number,
    errorMessage?: string
  ): Promise<number> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: {
        authorId: true,
      },
    });

    if (!course) {
      throw new RecordNotFoundException(errorMessage || "Course not found!");
    }

    return course.authorId;
  }

  protected async getUser(userId: number): Promise<{ role: Role } | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    return user;
  }

  protected async getUserOrThrow(
    userId: number,
    errorMessage?: string
  ): Promise<{ role: Role }> {
    const user = await this.getUser(userId);

    if (!user) {
      throw new RecordNotFoundException(errorMessage || "User is not found!");
    }

    return user;
  }

  protected async getCourseEnrollment(
    userId: number,
    courseId: number,
    select?: CourseEnrollmentSelect
  ): Promise<Partial<CourseEnrollmentModel> | null> {
    const enrollment = await this.prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      select: { id: true, ...select },
    });

    return enrollment;
  }

  protected async getCourseEnrollmentOrThrow(
    userId: number,
    courseId: number,
    select?: CourseEnrollmentSelect,
    error?: Error
  ): Promise<Partial<CourseEnrollmentModel>> {
    const enrollment = await this.getCourseEnrollment(userId, courseId, select);

    if (!enrollment) {
      throw error;
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
