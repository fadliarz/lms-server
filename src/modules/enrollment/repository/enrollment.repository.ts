import { CourseEnrollment, Role } from "@prisma/client";
import {
  CourseEnrollmentResourceId,
  CreateCourseEnrollmentDto,
  UpdateCourseEnrollmentRoleDto,
} from "../enrollment.type";
import { injectable } from "inversify";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";

export interface ICourseEnrollmentRepository {
  createEnrollment: (
    resourceId: CourseEnrollmentResourceId,
    dto: CreateCourseEnrollmentDto,
  ) => Promise<CourseEnrollment>;
  getEnrollmentById: (enrollmentId: number) => Promise<CourseEnrollment | null>;
  getEnrollmentByIdOrThrow: (
    enrollmentId: number,
    error?: Error,
  ) => Promise<CourseEnrollment>;
  updateEnrollmentRole: (
    enrollmentId: number,
    resourceId: CourseEnrollmentResourceId,
    dto: UpdateCourseEnrollmentRoleDto,
  ) => Promise<CourseEnrollment>;
  deleteEnrollment: (
    enrollmentId: number,
    resourceId: CourseEnrollmentResourceId,
  ) => Promise<CourseEnrollment>;
}

@injectable()
export class CourseEnrollmentRepository implements ICourseEnrollmentRepository {
  private readonly prisma = PrismaClientSingleton.getInstance();
  private readonly enrollmentTable = this.prisma.courseEnrollment;

  public async createEnrollment(
    resourceId: CourseEnrollmentResourceId,
    dto: CreateCourseEnrollmentDto,
  ): Promise<CourseEnrollment> {
    return await this.prisma.$transaction(async (tx) => {
      const { courseId } = resourceId;
      const { role: enrollmentRole } = dto;
      const [enrollment] = await Promise.all([
        tx.courseEnrollment.create({
          data: dto,
        }),
        tx.course.update({
          where: {
            id: courseId,
          },
          data: {
            [isEqualOrIncludeRole(enrollmentRole, Role.STUDENT)
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
  }

  public async updateEnrollmentRole(
    enrollmentId: number,
    resourceId: CourseEnrollmentResourceId,
    dto: UpdateCourseEnrollmentRoleDto,
  ): Promise<CourseEnrollment> {
    return await this.prisma.$transaction(async (tx) => {
      const { courseId } = resourceId;
      const { role: updatedEnrollmentRole } = dto;
      const [updatedEnrollment] = await Promise.all([
        tx.courseEnrollment.update({
          where: {
            id: enrollmentId,
          },
          data: dto,
        }),
        tx.course.update({
          where: {
            id: courseId,
          },
          data: {
            [isEqualOrIncludeRole(updatedEnrollmentRole, Role.STUDENT)
              ? "totalStudents"
              : "totalInstructors"]: { increment: 1 },
            [isEqualOrIncludeRole(updatedEnrollmentRole.role, Role.STUDENT)
              ? "totalInstructors"
              : "totalStudents"]: { decrement: 1 },
          },
        }),
      ]);

      return updatedEnrollment;
    });
  }

  public async deleteEnrollment(
    enrollmentId: number,
    resourceId: CourseEnrollmentResourceId,
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
}
