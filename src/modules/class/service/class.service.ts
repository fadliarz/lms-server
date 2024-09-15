import { inject, injectable } from "inversify";
import { CourseClassDITypes, CourseClassResourceId } from "../class.type";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import {
  ICourseClassAuthorization,
  ICourseClassRepository,
  ICourseClassService,
} from "../class.interface";
import { UserModel } from "../../user/user.type";
import { $CourseClassAPI } from "../class.api";

@injectable()
export default class CourseClassService implements ICourseClassService {
  @inject(CourseClassDITypes.REPOSITORY)
  private readonly repository: ICourseClassRepository;

  @inject(CourseClassDITypes.AUTHORIZATION)
  private readonly authorization: ICourseClassAuthorization;

  public async createClass(
    user: UserModel,
    id: { resourceId: CourseClassResourceId },
    dto: $CourseClassAPI.CreateClass.Dto,
  ): Promise<$CourseClassAPI.CreateClass.Response["data"]> {
    try {
      await this.authorization.authorizeCreateClass(
        user,
        id.resourceId.courseId,
      );

      return await this.repository.createClass(
        { courseId: id.resourceId.courseId },
        dto,
      );
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getClasses(
    id: {
      resourceId: CourseClassResourceId;
    },
    query: $CourseClassAPI.GetClasses.Query,
  ): Promise<$CourseClassAPI.GetClasses.Response["data"]> {
    try {
      return await this.repository.getClasses(
        {
          courseId: id.resourceId.courseId,
        },
        query,
      );
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getClassById(id: {
    classId: number;
    resourceId: CourseClassResourceId;
  }): Promise<$CourseClassAPI.GetClassById.Response["data"]> {
    try {
      return await this.repository.getClassByIdOrThrow(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async updateClass(
    user: UserModel,
    id: {
      classId: number;
      resourceId: CourseClassResourceId;
    },
    dto: $CourseClassAPI.UpdateClass.Dto,
  ): Promise<$CourseClassAPI.UpdateClass.Response["data"]> {
    try {
      await this.authorization.authorizeUpdateClass(
        user,
        id.resourceId.courseId,
      );

      return await this.repository.updateClass(id, dto);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async deleteClass(
    user: UserModel,
    id: {
      classId: number;
      resourceId: CourseClassResourceId;
    },
  ): Promise<$CourseClassAPI.DeleteClass.Response["data"]> {
    try {
      await this.authorization.authorizeDeleteClass(
        user,
        id.resourceId.courseId,
      );

      return await this.repository.deleteClass(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }
}
