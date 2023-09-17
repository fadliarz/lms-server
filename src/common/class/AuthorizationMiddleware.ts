import { injectable } from "inversify";
import PrismaClientSingleton from "./PrismaClientSingleton";

@injectable()
export default abstract class AuthorizationMiddleware {
  protected readonly prisma = PrismaClientSingleton.getInstance();
  protected readonly userTable = this.prisma.user;
  protected readonly courseTable = this.prisma.course;
  protected readonly courseLessonTable = this.prisma.courseLesson;
  protected readonly courseEnrollmentTable = this.prisma.courseEnrollment;
  protected readonly courseLessonVideoTable = this.prisma.courseLessonVideo;
}
