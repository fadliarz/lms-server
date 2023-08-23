import { CourseEnrollment, Role } from "@prisma/client";
import {
  CourseEnrollmentModel,
  CreateCourseEnrollmentDto,
  UpdateCourseEnrollmentDto,
} from "../enrollment.type";
import { injectable } from "inversify";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";

export class ICourseEnrollmentRepository {
  delete: (enrollmentId: number, courseId: number) => Promise<CourseEnrollment>;
  update: (
    enrollmentId: number,
    courseId: number,
    enrollmentDetails: UpdateCourseEnrollmentDto
  ) => Promise<CourseEnrollment>;
  create: (
    courseId: number,
    enrollmentDetails: CreateCourseEnrollmentDto
  ) => Promise<CourseEnrollment>;
}

@injectable()
export class CourseEnrollmentRepository implements ICourseEnrollmentRepository {
  private readonly prisma = PrismaClientSingleton.getInstance();
  private readonly enrollmentTable = this.prisma.courseEnrollment;

  public async delete(
    enrollmentId: number,
    courseId: number
  ): Promise<CourseEnrollment> {
    try {
      const deletedEnrollment = await this.prisma.$transaction(async (tx) => {
        const deletedEnrollment = await tx.courseEnrollment.delete({
          where: {
            id: enrollmentId,
          },
        });

        await tx.course.update({
          where: {
            id: courseId,
          },
          data: {
            [isEqualOrIncludeRole(deletedEnrollment.role, Role.STUDENT)
              ? "totalStudents"
              : "totalInstructors"]: { decrement: 1 },
          },
        });

        return deletedEnrollment;
      });

      return deletedEnrollment;
    } catch (error) {
      throw error;
    }
  }

  public async update(
    enrollmentId: number,
    courseId: number,
    enrollmentDetails: UpdateCourseEnrollmentDto
  ): Promise<CourseEnrollment> {
    try {
      const updatedEnrollment = await this.prisma.$transaction(async (tx) => {
        const [updatedEnrollment] = await Promise.all([
          tx.courseEnrollment.update({
            where: {
              id: enrollmentId,
            },
            data: enrollmentDetails,
          }),
          tx.course.update({
            where: {
              id: courseId,
            },
            data: {
              [isEqualOrIncludeRole(enrollmentDetails.role, Role.STUDENT)
                ? "totalStudents"
                : "totalInstructors"]: { increment: 1 },
              [isEqualOrIncludeRole(enrollmentDetails.role, Role.STUDENT)
                ? "totalInstructors"
                : "totalStudents"]: { decrement: 1 },
            },
          }),
        ]);

        return updatedEnrollment;
      });

      return updatedEnrollment;
    } catch (error) {
      throw error;
    }
  }

  public async create(
    courseId: number,
    enrollmentDetails: CreateCourseEnrollmentDto
  ): Promise<CourseEnrollment> {
    try {
      const enrollment = await this.prisma.$transaction(async (tx) => {
        const [enrollment] = await Promise.all([
          tx.courseEnrollment.create({
            data: { courseId, ...enrollmentDetails },
          }),
          tx.course.update({
            where: {
              id: courseId,
            },
            data: {
              [isEqualOrIncludeRole(enrollmentDetails.role, Role.STUDENT)
                ? "totalStudents"
                : "totalInstructors"]: { increment: 1 },
            },
            select: {},
          }),
        ]);

        return enrollment;
      });

      return enrollment;
    } catch (error) {
      throw error;
    }
  }
}
