import AuthorizationMiddleware from "./AuthorizationMiddleware";
import RecordNotFoundException from "../exceptions/RecordNotFoundException";
import { Course, CourseEnrollment, CourseLike, Role } from "@prisma/client";

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
    likeId: number
  ): Promise<Pick<CourseLike, "userId" | "courseId"> | null> {
    try {
      const like = await this.courseLikeTable.findUnique({
        where: {
          id: likeId,
        },
        select: {
          courseId: true,
          userId: true,
        },
      });

      return like ? like : null;
    } catch (error) {
      throw error;
    }
  }

  protected async getLikeByIdOrThrow(
    likeId: number,
    errorObject: Error
  ): Promise<Pick<CourseLike, "userId" | "courseId">> {
    try {
      const id = await this.getLikeById(likeId);
      if (!id) {
        throw errorObject ? errorObject : new RecordNotFoundException();
      }

      return id;
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
