import { inject, injectable } from "inversify";
import BaseService from "../../../common/class/BaseService";
import {
  ICourseClassAssignmentCompletionAuthorization,
  ICourseClassAssignmentCompletionRepository,
  ICourseClassAssignmentCompletionService,
} from "../completion.interface";
import {
  CourseClassAssignmentCompletionDITypes,
  CourseClassAssignmentCompletionResourceId,
} from "../completion.type";
import { UserModel } from "../../user/user.type";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import { $CourseClassAssignmentCompletionAPI } from "../completion.api";

@injectable()
export default class CourseClassAssignmentCompletionService
  extends BaseService
  implements ICourseClassAssignmentCompletionService
{
  @inject(CourseClassAssignmentCompletionDITypes.REPOSITORY)
  private readonly repository: ICourseClassAssignmentCompletionRepository;

  @inject(CourseClassAssignmentCompletionDITypes.AUTHORIZATION)
  private readonly authorization: ICourseClassAssignmentCompletionAuthorization;

  public async createCompletion(
    user: UserModel,
    id: { resourceId: CourseClassAssignmentCompletionResourceId },
    dto: $CourseClassAssignmentCompletionAPI.CreateCompletion.Dto,
  ): Promise<
    $CourseClassAssignmentCompletionAPI.CreateCompletion.Response["data"]
  > {
    try {
      await this.authorization.authorizeCreateCompletion(user, {
        courseId: id.resourceId.courseId,
        targetUserId: dto.userId,
      });

      const { assignmentId, ...theResourceId } = id.resourceId;

      return await this.repository.createCompletion(
        { assignmentId, resourceId: theResourceId },
        dto,
      );
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async updateCompletion(
    user: UserModel,
    id: {
      completionId: number;
      resourceId: CourseClassAssignmentCompletionResourceId;
    },
    dto: $CourseClassAssignmentCompletionAPI.UpdateCompletion.Dto,
  ): Promise<
    $CourseClassAssignmentCompletionAPI.DeleteCompletion.Response["data"]
  > {
    try {
      await this.authorization.authorizeUpdateCompletion(user, id.completionId);

      return await this.repository.updateCompletion(id, dto);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async deleteCompletion(
    user: UserModel,
    id: {
      completionId: number;
      resourceId: CourseClassAssignmentCompletionResourceId;
    },
  ): Promise<
    $CourseClassAssignmentCompletionAPI.DeleteCompletion.Response["data"]
  > {
    try {
      await this.authorization.authorizeDeleteCompletion(user, id.completionId);

      return await this.repository.deleteCompletion(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }
}
