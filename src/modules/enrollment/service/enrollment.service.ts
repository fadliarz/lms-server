import "reflect-metadata";
import { inject, injectable } from "inversify";
import {
  CourseEnrollmentDITypes,
  CourseEnrollmentModel,
  CourseEnrollmentResourceId,
  CreateCourseEnrollmentDto,
  UpdateCourseEnrollmentRoleDto,
} from "../enrollment.type";
import { ICourseEnrollmentRepository } from "../repository/enrollment.repository";
import { CourseDITypes } from "../../course/course.type";
import { ICourseRepository } from "../../course/repository/course.repository";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";

export interface ICourseEnrollmentService {
  createEnrollment: (
    resourceId: CourseEnrollmentResourceId,
    dto: CreateCourseEnrollmentDto,
  ) => Promise<CourseEnrollmentModel>;
  updateEnrollmentRole: (
    enrollmentId: number,
    resourceId: CourseEnrollmentResourceId,
    dto: UpdateCourseEnrollmentRoleDto,
  ) => Promise<CourseEnrollmentModel>;
  deleteEnrollment: (
    enrollmentId: number,
    resourceId: CourseEnrollmentResourceId,
  ) => Promise<{}>;
}

@injectable()
export class CourseEnrollmentService implements ICourseEnrollmentService {
  @inject(CourseEnrollmentDITypes.REPOSITORY)
  repository: ICourseEnrollmentRepository;

  @inject(CourseDITypes.REPOSITORY)
  courseRepository: ICourseRepository;

  /**
   *
   * Course & Enrollment existence and their relation should be checked in Repository layer while authorizing because
   * it's necessary to lock the rows while performing the features.
   *
   * So no need to implement those type of business logic in Service layer.
   *
   */

  public async createEnrollment(
    resourceId: CourseEnrollmentResourceId,
    dto: CreateCourseEnrollmentDto,
  ): Promise<CourseEnrollmentModel> {
    try {
      return await this.repository.createEnrollment(resourceId, dto);
    } catch (error: any) {
      throw handleRepositoryError(error, {
        uniqueConstraint: {
          default: {
            message: "User is already enrolled!",
          },
        },
        foreignConstraint: {
          default: {
            message: "User or course doesn't exist!",
          },
        },
      });
    }
  }

  public async updateEnrollmentRole(
    enrollmentId: number,
    resourceId: CourseEnrollmentResourceId,
    dto: UpdateCourseEnrollmentRoleDto,
  ): Promise<CourseEnrollmentModel> {
    return await this.repository.updateEnrollmentRole(
      enrollmentId,
      resourceId,
      dto,
    );
  }

  public async deleteEnrollment(
    enrollmentId: number,
    resourceId: CourseEnrollmentResourceId,
  ): Promise<{}> {
    return await this.repository.deleteEnrollment(enrollmentId, resourceId);
  }
}
