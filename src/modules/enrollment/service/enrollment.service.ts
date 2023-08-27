import { inject, injectable } from "inversify";
import {
  CourseEnrollmentDITypes,
  CourseEnrollmentModel,
  CreateCourseEnrollmentDto,
  DeleteCourseEnrollmentIds,
  UpdateCourseEnrollmentDto,
  UpdateCourseEnrollmentIds,
} from "../enrollment.type";
import { ICourseEnrollmentRepository } from "../repository/enrollment.repository";
import getValuable from "../../../common/functions/getValuable";
import { CourseEnrollment } from "@prisma/client";

export interface ICourseEnrollmentService {
  delete: (
    enrollmentId: number,
    ids: DeleteCourseEnrollmentIds,
    enrollment: CourseEnrollment
  ) => Promise<CourseEnrollmentModel>;
  update: (
    enrollmentId: number,
    ids: UpdateCourseEnrollmentIds,
    enrollmentDetails: UpdateCourseEnrollmentDto
  ) => Promise<CourseEnrollmentModel>;
  create: (
    enrollmentDetails: CreateCourseEnrollmentDto
  ) => Promise<CourseEnrollmentModel>;
}

@injectable()
export class CourseEnrollmentService implements ICourseEnrollmentService {
  @inject(CourseEnrollmentDITypes.REPOSITORY)
  repository: ICourseEnrollmentRepository;

  public async delete(
    enrollmentId: number,
    ids: DeleteCourseEnrollmentIds,
    enrollment: CourseEnrollment
  ): Promise<CourseEnrollmentModel> {
    try {
      const deletedEnrollment = await this.repository.delete(
        enrollmentId,
        ids,
        enrollment
      );

      return getValuable(deletedEnrollment);
    } catch (error) {
      throw error;
    }
  }

  public async update(
    enrollmentId: number,
    ids: UpdateCourseEnrollmentIds,
    enrollmentDetails: UpdateCourseEnrollmentDto
  ): Promise<CourseEnrollmentModel> {
    try {
      const updatedEnrollment = await this.repository.update(
        enrollmentId,
        ids,
        enrollmentDetails
      );

      return getValuable(updatedEnrollment);
    } catch (error) {
      throw error;
    }
  }

  public async create(
    enrollmentDetails: CreateCourseEnrollmentDto
  ): Promise<CourseEnrollmentModel> {
    try {
      const enrollment = await this.repository.create(enrollmentDetails);

      return getValuable(enrollment);
    } catch (error) {
      throw error;
    }
  }
}
