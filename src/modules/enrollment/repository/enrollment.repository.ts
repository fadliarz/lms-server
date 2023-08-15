import { CourseEnrollment, PrismaClient, Role } from "@prisma/client";
import dIContainer from "../../../inversifyConfig";
import {
  CourseEnrollmentModel,
  CreateCourseEnrollmentDto,
  UpdateCourseEnrollmentDto,
} from "../enrollment.type";
import { databaseDITypes } from "../../../common/constants/databaseDITypes";
import { injectable } from "inversify";
import { isEqualOrIncludeRole } from "../../../common/functions/isEqualOrIncludeRole";

export class ICourseEnrollmentRepository {
  deleteEnrollment: (
    enrollmentId: number,
    enrollmentDetails: CourseEnrollmentModel
  ) => Promise<CourseEnrollment>;
  updateEnrollment: (
    enrollmentId: number,
    enrollmentDetails: UpdateCourseEnrollmentDto
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

  public async deleteEnrollment(
    enrollmentId: number,
    enrollmentDetails: CourseEnrollmentModel
  ): Promise<CourseEnrollment> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const [deletedEnrollment] = await Promise.all([
          tx.courseEnrollment.delete({
            where: {
              id: enrollmentId,
            },
          }),

          tx.course.update({
            where: {
              id: enrollmentDetails.courseId,
            },
            data: {
              [isEqualOrIncludeRole(enrollmentDetails.role, Role.STUDENT)
                ? "totalStudents"
                : "totalInstructors"]: { decrement: 1 },
            },
          }),
        ]);

        return deletedEnrollment;
      });
    } catch (error) {
      throw error;
    }
  }

  public async updateEnrollment(
    enrollmentId: number,
    enrollmentDetails: UpdateCourseEnrollmentDto
  ): Promise<CourseEnrollment> {
    try {
      const updatedEnrollment = this.prisma.courseEnrollment.update({
        where: {
          id: enrollmentId,
        },
        data: {
          ...enrollmentDetails,
          course: {
            update: {
              [isEqualOrIncludeRole(enrollmentDetails.role, Role.STUDENT)
                ? "totalStudents"
                : "totalInstructors"]: { increment: 1 },
              [isEqualOrIncludeRole(enrollmentDetails.role, Role.STUDENT)
                ? "totalInstructors"
                : "totalStudents"]: { decrement: 1 },
            },
          },
        },
      });

      return updatedEnrollment;
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
            select: {},
          }),
        ]);

        return enrollment;
      });
    } catch (error) {
      throw error;
    }
  }
}
