import { inject, injectable } from "inversify";
import {
  CourseEnrollmentDITypes,
  CourseEnrollmentModel,
  CreateCourseEnrollmentDto,
} from "../enrollment.type";
import { ICourseEnrollmentRepository } from "../repository/enrollment.repository";
import { getValuable } from "../../../common/functions/getValuable";

export interface ICourseEnrollmentService {
  deleteEnrollment: (
    userId: string,
    courseId: string
  ) => Promise<CourseEnrollmentModel>;
  createEnrollment: (
    enrollmentDetails: CreateCourseEnrollmentDto
  ) => Promise<CourseEnrollmentModel>;
}

@injectable()
export class CourseEnrollmentService implements ICourseEnrollmentService {
  @inject(CourseEnrollmentDITypes.COURSE_ENROLLMENT_REPOSITORY)
  courseEnrollmentRepository: ICourseEnrollmentRepository;

  public async deleteEnrollment(
    userId: string,
    courseId: string
  ): Promise<CourseEnrollmentModel> {
    try {
      const deletedEnrollment =
        await this.courseEnrollmentRepository.deleteEnrollment(
          userId,
          courseId
        );

      return getValuable(deletedEnrollment);
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
