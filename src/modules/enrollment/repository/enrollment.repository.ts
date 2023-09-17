import { CourseEnrollment, Role } from "@prisma/client";
import {
  CreateCourseEnrollmentDto,
  DeleteCourseEnrollmentIds,
  UpdateCourseEnrollmentDto,
  UpdateCourseEnrollmentIds,
} from "../enrollment.type";
import { injectable } from "inversify";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";

export class ICourseEnrollmentRepository {
  delete: (
    enrollmentId: number,
    ids: DeleteCourseEnrollmentIds,
    enrollment: CourseEnrollment
  ) => Promise<CourseEnrollment>;
  update: (
    enrollmentId: number,
    ids: UpdateCourseEnrollmentIds,
    enrollmentDetails: UpdateCourseEnrollmentDto
  ) => Promise<CourseEnrollment>;
  create: (
    enrollmentDetails: CreateCourseEnrollmentDto
  ) => Promise<CourseEnrollment>;
}

@injectable()
export class CourseEnrollmentRepository implements ICourseEnrollmentRepository {
  private readonly prisma = PrismaClientSingleton.getInstance();
  private readonly enrollmentTable = this.prisma.courseEnrollment;

  public async delete(
    enrollmentId: number,
    ids: DeleteCourseEnrollmentIds,
    enrollment: CourseEnrollment
  ): Promise<CourseEnrollment> {
    const deletedEnrollment = await this.prisma.$transaction(async (tx) => {
      const [deletedEnrollment] = await Promise.all([
        tx.courseEnrollment.delete({
          where: {
            id: enrollmentId,
          },
        }),
        tx.course.update({
          where: {
            id: ids.courseId,
          },
          data: {
            [isEqualOrIncludeRole(enrollment.role, Role.STUDENT)
              ? "totalStudents"
              : "totalInstructors"]: { decrement: 1 },
          },
        }),
      ]);

      return deletedEnrollment;
    });

    return deletedEnrollment;
  }

  public async update(
    enrollmentId: number,
    ids: UpdateCourseEnrollmentIds,
    enrollmentDetails: UpdateCourseEnrollmentDto
  ): Promise<CourseEnrollment> {
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
            id: ids.courseId,
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
  }

  public async create(
    enrollmentDetails: CreateCourseEnrollmentDto
  ): Promise<CourseEnrollment> {
    const enrollment = await this.prisma.$transaction(async (tx) => {
      const [enrollment] = await Promise.all([
        tx.courseEnrollment.create({
          data: enrollmentDetails,
        }),
        tx.course.update({
          where: {
            id: enrollmentDetails.courseId,
          },
          data: {
            [isEqualOrIncludeRole(enrollmentDetails.role, Role.STUDENT)
              ? "totalStudents"
              : "totalInstructors"]: { increment: 1 },
          },
          select: {
            id: true,
          },
        }),
      ]);

      return enrollment;
    });

    return enrollment;
  }
}
