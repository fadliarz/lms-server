import { inject, injectable } from "inversify";
import {
  $CourseClassAssignmentAPI,
  CourseClassAssignmentDITypes,
  CourseClassAssignmentResourceId,
} from "../assignment.type";
import {
  ICourseClassAssignmentAuthorization,
  ICourseClassAssignmentRepository,
  ICourseClassAssignmentService,
} from "../assignment.interface";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import { UserModel } from "../../user/user.type";

@injectable()
export default class CourseClassAssignmentService
  implements ICourseClassAssignmentService
{
  @inject(CourseClassAssignmentDITypes.REPOSITORY)
  private readonly repository: ICourseClassAssignmentRepository;

  @inject(CourseClassAssignmentDITypes.AUTHORIZATION)
  private readonly authorization: ICourseClassAssignmentAuthorization;

  public async createAssignment(
    user: UserModel,
    id: { resourceId: CourseClassAssignmentResourceId },
    dto: $CourseClassAssignmentAPI.CreateAssignment.Dto,
  ): Promise<$CourseClassAssignmentAPI.CreateAssignment.Response["data"]> {
    try {
      await this.authorization.authorizeCreateAssignment(
        user,
        id.resourceId.courseId,
      );

      return await this.repository.createAssignment(
        {
          classId: id.resourceId.classId,
          resourceId: id.resourceId,
        },
        dto,
      );
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getAssignments(
    user: UserModel,
    id: {
      resourceId: CourseClassAssignmentResourceId;
    },
  ): Promise<$CourseClassAssignmentAPI.GetAssignments.Response["data"]> {
    try {
      await this.authorization.authorizeReadAssignment(
        user,
        id.resourceId.courseId,
      );

      return await this.repository.getAssignments({
        classId: id.resourceId.classId,
        resourceId: id.resourceId,
      });
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getAssignmentById(
    user: UserModel,
    id: {
      assignmentId: number;
      resourceId: CourseClassAssignmentResourceId;
    },
  ): Promise<$CourseClassAssignmentAPI.GetAssignmentById.Response["data"]> {
    try {
      await this.authorization.authorizeReadAssignment(
        user,
        id.resourceId.courseId,
      );

      return await this.repository.getAssignmentByIdOrThrow(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async updateAssignment(
    user: UserModel,
    id: {
      assignmentId: number;
      resourceId: CourseClassAssignmentResourceId;
    },
    dto: $CourseClassAssignmentAPI.UpdateAssignment.Dto,
  ): Promise<$CourseClassAssignmentAPI.UpdateAssignment.Response["data"]> {
    try {
      await this.authorization.authorizeUpdateAssignment(
        user,
        id.resourceId.courseId,
      );

      return await this.repository.updateAssignment(id, dto);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async deleteAssignment(
    user: UserModel,
    id: {
      assignmentId: number;
      resourceId: CourseClassAssignmentResourceId;
    },
  ): Promise<$CourseClassAssignmentAPI.DeleteAssignment.Response["data"]> {
    try {
      await this.authorization.authorizeDeleteAssignment(
        user,
        id.resourceId.courseId,
      );

      return await this.repository.deleteAssignment(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }
}
