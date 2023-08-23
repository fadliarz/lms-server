import { inject, injectable } from "inversify";
import {
  CourseEnrollmentDITypes,
  CourseEnrollmentModel,
  CreateCourseEnrollmentDto,
  UpdateCourseEnrollmentDto,
} from "../enrollment.type";
import { ICourseEnrollmentRepository } from "../repository/enrollment.repository";
import getValuable from "../../../common/functions/getValuable";

export interface ICourseEnrollmentService {
  delete: (
    enrollmentId: number,
    courseId: number
  ) => Promise<CourseEnrollmentModel>;
  update: (
    enrollmentId: number,
    courseId: number,
    enrollmentDetails: UpdateCourseEnrollmentDto
  ) => Promise<CourseEnrollmentModel>;
  create: (
    courseId: number,
    enrollmentDetails: CreateCourseEnrollmentDto
  ) => Promise<CourseEnrollmentModel>;
}

@injectable()
export class CourseEnrollmentService implements ICourseEnrollmentService {
  @inject(CourseEnrollmentDITypes.REPOSITORY)
  repository: ICourseEnrollmentRepository;

  public async delete(
    enrollmentId: number,
    courseId: number
  ): Promise<CourseEnrollmentModel> {
    try {
      const deletedEnrollment = await this.repository.delete(
        enrollmentId,
        courseId
      );

      return getValuable(deletedEnrollment);
    } catch (error) {
      throw error;
    }
  }

  public async update(
    enrollmentId: number,
    courseId: number,
    enrollmentDetails: UpdateCourseEnrollmentDto
  ): Promise<CourseEnrollmentModel> {
    try {
      const updatedEnrollment = await this.repository.update(
        enrollmentId,
        courseId,
        enrollmentDetails
      );

      return getValuable(updatedEnrollment);
    } catch (error) {
      throw error;
    }
  }

  public async create(
    courseId: number,
    enrollmentDetails: CreateCourseEnrollmentDto
  ): Promise<CourseEnrollmentModel> {
    try {
      const enrollment = await this.repository.create(
        courseId,
        enrollmentDetails
      );

      return getValuable(enrollment);
    } catch (error) {
      throw error;
    }
  }
}
