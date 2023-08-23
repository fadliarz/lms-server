import { injectable } from "inversify";
import PrismaClientSingleton from "./PrismaClientSingleton";
import { Role, User } from "@prisma/client";
import RecordNotFoundException from "../exceptions/RecordNotFoundException";

@injectable()
export default abstract class AuthorizationMiddleware {
  protected readonly prisma = PrismaClientSingleton.getInstance();
  protected readonly userTable = this.prisma.user;
  protected readonly courseTable = this.prisma.course;
  protected readonly courseLessonTable = this.prisma.courseLesson;
  protected readonly courseEnrollmentTable = this.prisma.courseEnrollment;
  protected readonly courseLessonVideoTable = this.prisma.courseLessonVideo;

  protected async getUserRole(
    userId: number
  ): Promise<Pick<User, "role"> | null> {
    const user = await this.userTable.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    return user;
  }

  protected async getUserRoleOrThrow(
    userId: number,
    error?: Error
  ): Promise<Role> {
    const user = await this.getUserRole(userId);

    if (!user) {
      throw error || new RecordNotFoundException();
    }

    return user.role;
  }
}
