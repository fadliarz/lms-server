import "reflect-metadata";
import { inject, injectable } from "inversify";
import {
  CourseDITypes,
  CourseLikeModel,
  CourseLikeResourceId,
  CourseModel,
  CourseResourceId,
} from "../course.type";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import {
  ICourseAuthorization,
  ICourseRepository,
  ICourseService,
} from "../course.interface";
import { $CourseAPI } from "../course.api";

@injectable()
export default class CourseService implements ICourseService {
  @inject(CourseDITypes.REPOSITORY)
  private readonly repository: ICourseRepository;

  @inject(CourseDITypes.AUTHORIZATION)
  private readonly authorization: ICourseAuthorization;

  public async createCourse(
    id: { resourceId: CourseResourceId },
    dto: $CourseAPI.CreateCourse.Dto,
  ): Promise<CourseModel> {
    try {
      await this.authorization.authorizeCreateCourse(id.resourceId.user);

      return await this.repository.createCourse({
        ...dto,
        authorId: id.resourceId.user.id,
      });
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getCourses(
    query: $CourseAPI.GetCourses.Query,
  ): Promise<$CourseAPI.GetCourses.Response["data"]> {
    try {
      return await this.repository.getCourses(query);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getCourseById(
    id: {
      courseId: number;
    },
    query: $CourseAPI.GetCourseById.Query,
  ): Promise<$CourseAPI.GetCourseById.Response["data"]> {
    try {
      return await this.repository.getCourseByIdOrThrow(id, query);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async updateCourse(
    id: {
      courseId: number;
      resourceId: CourseResourceId;
    },
    dto: $CourseAPI.UpdateCourse.Dto,
  ): Promise<CourseModel> {
    try {
      await this.authorization.authorizeUpdateCourse(
        id.resourceId.user,
        id.courseId,
      );

      return await this.repository.updateCourse(id, dto);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async updateCourseStatus(
    id: {
      courseId: number;
      resourceId: CourseResourceId;
    },
    dto: $CourseAPI.UpdateCourseStatus.Dto,
  ): Promise<CourseModel> {
    try {
      await this.authorization.authorizeUpdateCourse(
        id.resourceId.user,
        id.courseId,
      );

      return await this.repository.updateCourse(id, dto);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async updateCourseCategoryId(
    id: {
      courseId: number;
      resourceId: CourseResourceId;
    },
    dto: $CourseAPI.UpdateCourseCategoryId.Dto,
  ): Promise<CourseModel> {
    try {
      await this.authorization.authorizeUpdateCourse(
        id.resourceId.user,
        id.courseId,
      );

      return await this.repository.updateCourse(id, dto);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async updateCourseCode(
    id: {
      courseId: number;
      resourceId: CourseResourceId;
    },
    dto: $CourseAPI.UpdateCourseCode.Dto,
  ): Promise<CourseModel> {
    try {
      await this.authorization.authorizeUpdateCourse(
        id.resourceId.user,
        id.courseId,
      );

      return await this.repository.updateCourse(id, dto);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async deleteCourse(id: {
    courseId: number;
    resourceId: CourseResourceId;
  }): Promise<{}> {
    try {
      await this.authorization.authorizeDeleteCourse(
        id.resourceId.user,
        id.courseId,
      );

      return await this.repository.deleteCourse(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async createLike(id: {
    resourceId: CourseLikeResourceId;
  }): Promise<CourseLikeModel> {
    try {
      await this.authorization.authorizeCreateLike(
        id.resourceId.user,
        id.resourceId.params.courseId,
      );

      return await this.repository.createLike(
        {
          courseId: id.resourceId.params.courseId,
        },
        {
          userId: id.resourceId.user.id,
        },
      );
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async deleteLike(id: {
    likeId: number;
    resourceId: CourseLikeResourceId;
  }): Promise<{}> {
    try {
      await this.authorization.authorizeDeleteLike(
        id.resourceId.user,
        id.resourceId.params.courseId,
        id.likeId,
      );

      return await this.repository.deleteLike({
        likeId: id.likeId,
      });
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }
}
