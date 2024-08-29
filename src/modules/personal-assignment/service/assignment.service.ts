import { inject, injectable } from "inversify";
import {
  IPersonalAssignmentAuthorization,
  IPersonalAssignmentRepository,
  IPersonalAssignmentService,
} from "../assignment.interface";
import {
  PersonalAssignmentDITypes,
  PersonalAssignmentResourceId,
} from "../assignment.type";
import { UserModel } from "../../user/user.type";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import { $PersonalAssignmentAPI } from "../assignment.api";

@injectable()
export default class PersonalAssignmentService
  implements IPersonalAssignmentService
{
  @inject(PersonalAssignmentDITypes.REPOSITORY)
  private readonly repository: IPersonalAssignmentRepository;

  @inject(PersonalAssignmentDITypes.AUTHORIZATION)
  private readonly authorization: IPersonalAssignmentAuthorization;

  public async createAssignment(
    user: UserModel,
    id: {
      resourceId: PersonalAssignmentResourceId;
    },
    dto: $PersonalAssignmentAPI.CreateAssignment.Dto,
  ): Promise<$PersonalAssignmentAPI.CreateAssignment.Response["data"]> {
    try {
      this.authorization.authorizeCreateAssignment(user, id.resourceId.userId);

      return await this.repository.createAssignment(
        { userId: id.resourceId.userId },
        dto,
      );
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async updateAssignment(
    user: UserModel,
    id: {
      assignmentId: number;
      resourceId: PersonalAssignmentResourceId;
    },
    dto: $PersonalAssignmentAPI.UpdateAssignment.Dto,
  ): Promise<$PersonalAssignmentAPI.UpdateAssignment.Response["data"]> {
    try {
      await this.authorization.authorizeUpdateAssignment(user, id.assignmentId);

      return await this.repository.updateAssignment(id, dto);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async deleteAssignment(
    user: UserModel,
    id: {
      assignmentId: number;
      resourceId: PersonalAssignmentResourceId;
    },
  ): Promise<$PersonalAssignmentAPI.DeleteAssignment.Response["data"]> {
    try {
      await this.authorization.authorizeDeleteAssignment(user, id.assignmentId);

      return await this.repository.deleteAssignment(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }
}
