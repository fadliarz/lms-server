import { inject, injectable } from "inversify";
import {
  CourseEnrollmentDITypes,
  CourseEnrollmentModel,
  CreateCourseEnrollmentDto,
  UpdateCourseEnrollmentDto,
} from "../enrollment.type";
import { ICourseEnrollmentRepository } from "../repository/enrollment.repository";
import { getValuable } from "../../../common/functions/getValuable";

export interface ICourseEnrollmentService {
  deleteEnrollment: (
    enrollmentId: number,
    enrollmentDetails: CourseEnrollmentModel
  ) => Promise<CourseEnrollmentModel>;
  updateEnrollment: (
    enrollmentId: number,
    enrollmentDetails: UpdateCourseEnrollmentDto
  ) => Promise<CourseEnrollmentModel>;
  createEnrollment: (
    enrollmentDetails: CreateCourseEnrollmentDto
  ) => Promise<CourseEnrollmentModel>;
}

@injectable()
export class CourseEnrollmentService implements ICourseEnrollmentService {
  @inject(CourseEnrollmentDITypes.REPOSITORY)
  courseEnrollmentRepository: ICourseEnrollmentRepository;

  public async deleteEnrollment(
    enrollmentId: number,
    enrollmentDetails: CourseEnrollmentModel
  ): Promise<CourseEnrollmentModel> {
    try {
      const deletedEnrollment =
        await this.courseEnrollmentRepository.deleteEnrollment(
          enrollmentId,
          enrollmentDetails
        );

      return getValuable(deletedEnrollment);
    } catch (error) {
      throw error;
    }
  }

  public async updateEnrollment(
    enrollmentId: number,
    enrollmentDetails: UpdateCourseEnrollmentDto
  ): Promise<CourseEnrollmentModel> {
    try {
      const updatedEnrollment =
        await this.courseEnrollmentRepository.updateEnrollment(
          enrollmentId,
          enrollmentDetails
        );

      return getValuable(updatedEnrollment);
    } catch (error) {
      throw error;
    }
  }

  public async createEnrollment(
    enrollmentDetails: CreateCourseEnrollmentDto
  ): Promise<CourseEnrollmentModel> {
    try {
      const enrollment = await this.courseEnrollmentRepository.createEnrollment(
        enrollmentDetails
      );

      return getValuable(enrollment);
    } catch (error) {
      throw error;
    }
  }
}
