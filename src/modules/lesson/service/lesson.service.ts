import { inject, injectable } from "inversify";
import {
  CourseLessonDITypes,
  CourseLessonModel,
  CourseLessonResourceId,
} from "../lesson.type";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import {
  ICourseLessonAuthorization,
  ICourseLessonRepository,
  ICourseLessonService,
} from "../lesson.interface";
import { UnauthenticatedResourceId } from "../../../common/types";
import { UserModel } from "../../user/user.type";
import { $CourseLessonAPI } from "../lesson.api";

@injectable()
export default class CourseLessonService implements ICourseLessonService {
  @inject(CourseLessonDITypes.REPOSITORY)
  private readonly repository: ICourseLessonRepository;

  @inject(CourseLessonDITypes.AUTHORIZATION)
  private readonly authorization: ICourseLessonAuthorization;

  public async createLesson(
    user: UserModel,
    id: { resourceId: CourseLessonResourceId },
    dto: $CourseLessonAPI.CreateLesson.Dto,
  ): Promise<CourseLessonModel> {
    try {
      await this.authorization.authorizeCreateLesson(
        user,
        id.resourceId.courseId,
      );

      return await this.repository.createLesson(
        { courseId: id.resourceId.courseId },
        dto,
      );
    } catch (error: any) {
      throw handleRepositoryError(error, {});
    }
  }

  public async getLessonById(id: {
    lessonId: number;
    resourceId: UnauthenticatedResourceId<CourseLessonResourceId>;
  }): Promise<CourseLessonModel> {
    try {
      return await this.repository.getLessonByIdOrThrow(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getLessons(id: {
    resourceId: CourseLessonResourceId;
  }): Promise<CourseLessonModel[]> {
    return await this.repository.getLessons({
      courseId: id.resourceId.courseId,
    });
  }

  public async updateLesson(
    user: UserModel,
    id: {
      lessonId: number;
      resourceId: CourseLessonResourceId;
    },
    dto: $CourseLessonAPI.UpdateLesson.Response["data"],
  ): Promise<CourseLessonModel> {
    try {
      await this.authorization.authorizeUpdateLesson(
        user,
        id.resourceId.courseId,
      );

      return await this.repository.updateLesson(id, dto);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async deleteLesson(
    user: UserModel,
    id: {
      lessonId: number;
      resourceId: CourseLessonResourceId;
    },
  ): Promise<{}> {
    try {
      await this.authorization.authorizeDeleteLesson(
        user,
        id.resourceId.courseId,
      );

      return await this.repository.deleteLesson(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }
}
