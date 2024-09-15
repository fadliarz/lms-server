import "reflect-metadata";
import { inject, injectable } from "inversify";
import {
  CourseEnrollmentDITypes,
  CourseEnrollmentResourceId,
} from "../enrollment.type";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import {
  ICourseEnrollmentAuthorization,
  ICourseEnrollmentRepository,
  ICourseEnrollmentService,
} from "../enrollment.interface";
import { $CourseEnrollmentAPI } from "../enrollment.api";

@injectable()
export default class CourseEnrollmentService
  implements ICourseEnrollmentService
{
  @inject(CourseEnrollmentDITypes.REPOSITORY)
  repository: ICourseEnrollmentRepository;

  @inject(CourseEnrollmentDITypes.AUTHORIZATION)
  authorization: ICourseEnrollmentAuthorization;

  public async createEnrollment(
    resourceId: CourseEnrollmentResourceId,
    dto: $CourseEnrollmentAPI.CreateEnrollment.Dto,
  ): Promise<$CourseEnrollmentAPI.CreateEnrollment.Response["data"]> {
    try {
      this.authorization.authorizeCreateEnrollment(resourceId.user, dto);

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
      this.authorization.authorizeUpdateEnrollmentRole(resourceId.user);

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
      await this.authorization.authorizeDeleteEnrollment(
        resourceId.user,
        enrollmentId,
      );

      return await this.repository.deleteEnrollment({
        enrollmentId,
        resourceId: resourceId.params,
      });
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }
}
