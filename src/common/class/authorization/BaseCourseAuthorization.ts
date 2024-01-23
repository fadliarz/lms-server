import AuthorizationMiddleware from "./AuthorizationMiddleware";
import RecordNotFoundException from "../exceptions/RecordNotFoundException";
import { Role } from "@prisma/client";
import { CourseLikeModel } from "../../../modules/course/course.type";
import getValuable from "../../functions/getValuable";
import { CourseEnrollmentModel } from "../../../modules/enrollment/enrollment.type";

export class BaseCourseAuthorization extends AuthorizationMiddleware {
  protected async getAuthorId(courseId: number): Promise<number | null> {
    try {
      const course = await this.table.course.findUnique(courseId);

      return course ? course.authorId : null;
    } catch (error) {
      throw error;
    }
  }

  protected async getAuthorIdOrThrow(
    courseId: number,
    error?: Error,
  ): Promise<number> {
    const authorId = await this.getAuthorId(courseId);

    if (!authorId) {
      throw error || new RecordNotFoundException("Course not found!");
    }

    return authorId;
  }

  protected async getLikeById(likeId: number): Promise<CourseLikeModel | null> {
    try {
      const like = await this.table.courseLike.findUnique(likeId);

      return like === null ? like : getValuable(like);
    } catch (error) {
      throw error;
    }
  }

  protected async getLikeByIdOrThrow(
    courseId: number,
    likeId: number,
    userId: number,
    errorObject?: Error,
  ): Promise<Pick<CourseLikeModel, "userId" | "courseId">> {
    try {
      const like = await this.getLikeById(likeId);
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
    courseId: number,
  ): Promise<Role | null> {
    try {
      const enrollment =
        await this.table.courseEnrollment.findUniqueByUserIdAndCourseId(
          userId,
          courseId,
        );

      return enrollment ? enrollment.role : null;
    } catch (error) {
      throw error;
    }
  }

  protected async getEnrollmentById(
    userId: number,
    courseId: number,
  ): Promise<CourseEnrollmentModel | null> {
    try {
      const enrollment =
        await this.table.courseEnrollment.findUniqueByUserIdAndCourseId(
          userId,
          courseId,
        );

      return enrollment ? getValuable(enrollment) : enrollment;
    } catch (error) {
      throw error;
    }
  }
}
