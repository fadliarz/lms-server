import "reflect-metadata";
import { inject, injectable } from "inversify";
import {
  $CourseEnrollmentAPI,
  CourseEnrollmentDITypes,
  CourseEnrollmentResourceId,
} from "../enrollment.type";
import { CourseDITypes } from "../../course/course.type";
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

  public async createEnrollment(
    resourceId: CourseEnrollmentResourceId,
    dto: $CourseEnrollmentAPI.CreateEnrollment.Dto,
  ): Promise<$CourseEnrollmentAPI.CreateEnrollment.Response["data"]> {
    try {
      return await this.repository.createEnrollment(resourceId.params, dto);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async updateEnrollment(
    enrollmentId: number,
    resourceId: CourseEnrollmentResourceId,
    dto: $CourseEnrollmentAPI.UpdateEnrollment.Dto,
  ): Promise<$CourseEnrollmentAPI.UpdateEnrollment.Response["data"]> {
    try {
      return await this.repository.updateEnrollment(
        { enrollmentId, resourceId: resourceId.params },
        dto,
      );
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async deleteEnrollment(
    enrollmentId: number,
    resourceId: CourseEnrollmentResourceId,
  ): Promise<{}> {
    try {
      return await this.repository.deleteEnrollment({
        enrollmentId,
        resourceId: resourceId.params,
      });
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }
}
