import "reflect-metadata";
import { inject, injectable } from "inversify";
import {
  CourseEnrollmentDITypes,
  CourseEnrollmentErrorMessage,
  CourseEnrollmentModel,
  CourseEnrollmentResourceId,
  CreateCourseEnrollmentDto,
  UpdateCourseEnrollmentRoleDto,
} from "../enrollment.type";
import { CourseDITypes, CourseErrorMessage } from "../../course/course.type";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import { ICourseRepository } from "../../course/course.interface";
import {
  ICourseEnrollmentRepository,
  ICourseEnrollmentService,
} from "../enrollment.interface";

@injectable()
export default class CourseEnrollmentService
  implements ICourseEnrollmentService
{
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
            message:
              CourseEnrollmentErrorMessage.TARGET_USER_IS_ALREADY_ENROLLED,
          },
        },
        foreignConstraint: {
          default: {
            message:
              CourseEnrollmentErrorMessage.TARGET_USER_DOES_NOT_EXIST.concat(
                " or ",
                CourseErrorMessage.COURSE_DOES_NOT_EXIST,
              ),
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
