import { inject, injectable } from "inversify";
import {
  IDepartmentProgramEnrollmentAuthorization,
  IDepartmentProgramEnrollmentRepository,
  IDepartmentProgramEnrollmentService,
} from "../enrollment.interface";
import {
  DepartmentProgramEnrollmentDITypes,
  DepartmentProgramEnrollmentResourceId,
} from "../enrollment.type";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import { UserModel } from "../../user/user.type";
import { $DepartmentProgramEnrollmentAPI } from "../enrollment.api";

@injectable()
export default class DepartmentProgramEnrollmentService
  implements IDepartmentProgramEnrollmentService
{
  @inject(DepartmentProgramEnrollmentDITypes.REPOSITORY)
  private readonly repository: IDepartmentProgramEnrollmentRepository;

  @inject(DepartmentProgramEnrollmentDITypes.AUTHORIZATION)
  private readonly authorization: IDepartmentProgramEnrollmentAuthorization;

  public async createEnrollment(
    user: UserModel,
    id: { resourceId: DepartmentProgramEnrollmentResourceId },
    dto: $DepartmentProgramEnrollmentAPI.CreateEnrollment.Dto,
  ): Promise<
    $DepartmentProgramEnrollmentAPI.CreateEnrollment.Response["data"]
  > {
    try {
      await this.authorization.authorizeCreateEnrollment(user, dto.userId);

      return await this.repository.createEnrollment(
        {
          programId: id.resourceId.programId,
          resourceId: id.resourceId,
        },
        dto,
      );
    } catch (error: any) {
      throw handleRepositoryError(error, {});
    }
  }

  public async deleteEnrollment(
    user: UserModel,
    id: {
      enrollmentId: number;
      resourceId: DepartmentProgramEnrollmentResourceId;
    },
  ): Promise<
    $DepartmentProgramEnrollmentAPI.DeleteEnrollment.Response["data"]
  > {
    try {
      const enrollment = await this.repository.getEnrollmentByIdOrThrow(id);

      await this.authorization.authorizeDeleteEnrollment(user, enrollment);

      return await this.repository.deleteEnrollment({
        enrollmentId: id.enrollmentId,
      });
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }
}
