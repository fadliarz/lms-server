import { inject, injectable } from "inversify";
import {
  IDepartmentDivisionEnrollmentAuthorization,
  IDepartmentDivisionEnrollmentRepository,
  IDepartmentDivisionEnrollmentService,
} from "../enrollment.interface";
import {
  $DepartmentDivisionEnrollmentAPI,
  DepartmentDivisionEnrollmentDITypes,
  DepartmentDivisionEnrollmentResourceId,
} from "../enrollment.type";
import {
  IRepository,
  RepositoryDITypes,
} from "../../../common/class/repository/repository.type";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import { UserModel } from "../../user/user.type";

@injectable()
export default class DepartmentDivisionEnrollmentService
  implements IDepartmentDivisionEnrollmentService
{
  @inject(DepartmentDivisionEnrollmentDITypes.REPOSITORY)
  private readonly repository: IDepartmentDivisionEnrollmentRepository;

  @inject(RepositoryDITypes.FACADE)
  private readonly globalRepository: IRepository;

  @inject(DepartmentDivisionEnrollmentDITypes.AUTHORIZATION)
  private readonly authorization: IDepartmentDivisionEnrollmentAuthorization;

  public async createEnrollment(
    user: UserModel,
    id: { resourceId: DepartmentDivisionEnrollmentResourceId },
    dto: $DepartmentDivisionEnrollmentAPI.CreateEnrollment.Dto,
  ): Promise<
    $DepartmentDivisionEnrollmentAPI.CreateEnrollment.Response["data"]
  > {
    try {
      await this.authorization.authorizeCreateEnrollment(
        user,
        id.resourceId.divisionId,
      );

      return await this.repository.createEnrollment(
        {
          divisionId: id.resourceId.divisionId,
          resourceId: id.resourceId,
        },
        dto,
      );
    } catch (error: any) {
      throw handleRepositoryError(error, {});
    }
  }

  public async getEnrollments(id: {
    resourceId: DepartmentDivisionEnrollmentResourceId;
  }): Promise<
    $DepartmentDivisionEnrollmentAPI.GetEnrollments.Response["data"]
  > {
    try {
      return await this.repository.getEnrollments({
        divisionId: id.resourceId.divisionId,
        resourceId: id.resourceId,
      });
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async deleteEnrollment(
    user: UserModel,
    id: {
      enrollmentId: number;
      resourceId: DepartmentDivisionEnrollmentResourceId;
    },
  ): Promise<
    $DepartmentDivisionEnrollmentAPI.DeleteEnrollment.Response["data"]
  > {
    try {
      await this.authorization.authorizeDeleteEnrollment(
        user,
        id.resourceId.divisionId,
      );

      return await this.repository.deleteEnrollment(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }
}
