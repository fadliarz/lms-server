import { CourseEnrollment, PrismaClient, Role } from "@prisma/client";
import dIContainer from "../../../inversifyConfig";
import { CreateCourseEnrollmentDto } from "../enrollment.type";
import { databaseDITypes } from "../../../common/constants/databaseDITypes";
import { v4 as uuidv4 } from "uuid";
import { injectable } from "inversify";

export class ICourseEnrollmentRepository {
  deleteEnrollment: (
    userId: string,
    courseId: string
  ) => Promise<CourseEnrollment>;
  createEnrollment: (
    enrollmentDetails: CreateCourseEnrollmentDto
  ) => Promise<CourseEnrollment>;
}

@injectable()
export class CourseEnrollmentRepository implements ICourseEnrollmentRepository {
  private readonly prisma = dIContainer.get<PrismaClient>(
    databaseDITypes.PRISMA_CLIENT
  );
  private readonly courseEnrollmentTable = this.prisma.courseEnrollment;

  public async deleteEnrollment(
    userId: string,
    courseId: string
  ): Promise<CourseEnrollment> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const { role } = await tx.courseEnrollment.findUniqueOrThrow({
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

        const [deletedEnrollment] = await Promise.all([
          tx.courseEnrollment.delete({
            where: {
              userId_courseId: {
                userId,
                courseId,
              },
            },
          }),
          tx.course.update({
            where: {
              id: courseId,
            },
            data: {
              [role.toString() === Role.INSTRUCTOR.toString()
                ? "totalInstructors"
                : "totalStudents"]: { decrement: 1 },
            },
          }),
        ]);

        return deletedEnrollment;
      });
    } catch (error) {
      throw error;
    }
  }
  public async createEnrollment(
    enrollmentDetails: CreateCourseEnrollmentDto
  ): Promise<CourseEnrollment> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const [enrollment] = await Promise.all([
          tx.courseEnrollment.create({
            data: {
              ...enrollmentDetails,
              id: uuidv4(),
            },
          }),
          tx.course.update({
            where: {
              id: enrollmentDetails.courseId,
            },
            data: {
              [enrollmentDetails.role.toString() === Role.STUDENT.toString()
                ? "totalStudents"
                : "totalInstructors"]: { increment: 1 },
            },
          }),
        ]);

        return enrollment;
      });
    } catch (error) {
      throw error;
    }
  }
}
