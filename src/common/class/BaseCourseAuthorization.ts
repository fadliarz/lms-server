import AuthorizationMiddleware from "./AuthorizationMiddleware";
import RecordNotFoundException from "../exceptions/RecordNotFoundException";
import { CourseEnrollment, CourseLike, Role } from "@prisma/client";
import { CourseLikeModel } from "../../modules/course/course.type";
import getValuable from "../functions/getValuable";

export class BaseCourseAuthorization extends AuthorizationMiddleware {
  protected async getAuthorId(courseId: number): Promise<number | null> {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
        select: {
          authorId: true,
        },
      });

      return course ? course.authorId : null;
    } catch (error) {
      throw error;
    }
  }

  protected async getAuthorIdOrThrow(
    courseId: number,
    errorObject?: Error
  ): Promise<number> {
    const authorId = await this.getAuthorId(courseId);

    if (!authorId) {
      throw errorObject || new RecordNotFoundException("Course not found!");
    }

    return authorId;
  }

  protected async getLikeById(
    courseId: number,
    likeId: number,
    userId: number
  ): Promise<Pick<CourseLikeModel, "userId" | "courseId"> | null> {
    try {
      const like = await this.courseLikeTable.findUnique({
        where: {
          id: likeId,
          courseId_userId: {
            courseId,
            userId,
          },
        },
        select: {
          courseId: true,
          userId: true,
        },
      });

      return like === null ? like : getValuable(like);
    } catch (error) {
      throw error;
    }
  }

  protected async getLikeByIdOrThrow(
    courseId: number,
    likeId: number,
    userId: number,
    errorObject?: Error
  ): Promise<Pick<CourseLikeModel, "userId" | "courseId">> {
    try {
      const like = await this.getLikeById(courseId, likeId, userId);
      if (!like) {
        throw errorObject ? errorObject : new RecordNotFoundException();
      }

      return like;
    } catch (error) {
      throw error;
    }
  }

  protected async getEnrollmentRoleById(
    userId: number,
    courseId: number
  ): Promise<Role | null> {
    try {
      const enrollment = await this.courseEnrollmentTable.findUnique({
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

      return enrollment ? enrollment.role : null;
    } catch (error) {
      throw error;
    }
  }

  protected async getEnrollmentById(
    userId: number,
    courseId: number
  ): Promise<Pick<CourseEnrollment, "userId" | "courseId" | "role"> | null> {
    try {
      const enrollment = await this.courseEnrollmentTable.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        select: {
          userId: true,
          courseId: true,
          role: true,
        },
      });

      return enrollment;
    } catch (error) {
      throw error;
    }
  }
}
