import AuthorizationMiddleware from "./AuthorizationMiddleware";
import RecordNotFoundException from "../exceptions/RecordNotFoundException";
import { injectable } from "inversify";

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
}
