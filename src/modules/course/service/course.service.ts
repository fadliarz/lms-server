import "reflect-metadata";
import { inject, injectable } from "inversify";
import {
  CourseLikeModel,
  CourseLikeResourceId,
  CourseModel,
  CourseResourceId,
  CreateCourseDto,
  GetCourseByIdData,
  GetCourseByIdQuery,
  GetCoursesData,
  GetCoursesQuery,
  GetEnrolledCoursesData,
  GetEnrolledCoursesQuery,
  UpdateBasicCourseDto,
  UpdateCourseCategoryIdDto,
  UpdateCourseCodeDto,
  UpdateCourseStatusDto,
} from "../course.type";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import {
  IRepository,
  RepositoryDITypes,
} from "../../../common/class/repository/repository.type";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import ClientException from "../../../common/class/exceptions/ClientException";

export interface ICourseService {
  createCourse: (
    resourceId: CourseResourceId,
    dto: CreateCourseDto,
  ) => Promise<CourseModel>;
  getCourseById: (
    courseId: number,
    resourceId: CourseResourceId,
    query: GetCourseByIdQuery,
  ) => Promise<GetCourseByIdData>;
  getCourses: (query: GetCoursesQuery) => Promise<GetCoursesData>;
  getEnrolledCourses: (
    resourceId: CourseResourceId,
    query: GetEnrolledCoursesQuery,
  ) => Promise<GetEnrolledCoursesData>;
  updateBasicCourse: (
    courseId: number,
    resourceId: CourseResourceId,
    dto: UpdateBasicCourseDto,
  ) => Promise<CourseModel>;
  updateCourseStatus: (
    courseId: number,
    resourceID: CourseResourceId,
    dto: UpdateCourseStatusDto,
  ) => Promise<CourseModel>;
  updateCourseCategoryId: (
    courseId: number,
    resourceId: CourseResourceId,
    dto: UpdateCourseCategoryIdDto,
  ) => Promise<CourseModel>;
  updateCourseCode: (
    courseId: number,
    resourceId: CourseResourceId,
    dto: UpdateCourseCodeDto,
  ) => Promise<CourseModel>;
  deleteCourse: (courseId: number, resourceId: CourseResourceId) => Promise<{}>;
  createLike: (resourceId: CourseLikeResourceId) => Promise<CourseLikeModel>;
  deleteLike: (likeId: number, resourceId: CourseLikeResourceId) => Promise<{}>;
  validateRelationBetweenResources: (
    id: {
      likeId: number;
      resourceId: CourseLikeResourceId;
    },
    error?: Error,
  ) => Promise<CourseLikeModel | null>;
}

/**
 * Todo: Implement Unit of Work pattern, so transaction can be shared across layers
 *
 */

@injectable()
export class CourseService implements ICourseService {
  @inject(RepositoryDITypes.FACADE)
  private readonly repository: IRepository;

  public async createCourse(
    resourceId: CourseResourceId,
    dto: CreateCourseDto,
  ): Promise<CourseModel> {
    try {
      return await this.repository.course.createCourse(resourceId, dto);
    } catch (error: any) {
      throw handleRepositoryError(error, {
        foreignConstraint: {
          default: { message: "Category doesn't exist!" },
        },
        uniqueConstraint: {
          code: {
            message: "Code is already taken!",
          },
        },
      });
    }
  }

  public async getCourseById(
    courseId: number,
    resourceId: CourseResourceId,
    query: GetCourseByIdQuery,
  ): Promise<GetCourseByIdData> {
    return await this.repository.course.getCourseByIdOrThrow(
      courseId,
      resourceId,
      query,
      new RecordNotFoundException(),
    );
  }

  public async getCourses(query: GetCoursesQuery): Promise<GetCoursesData> {
    return await this.repository.course.getCourses(query);
  }

  public async getEnrolledCourses(
    resourceId: CourseResourceId,
    query: GetEnrolledCoursesQuery,
  ): Promise<GetEnrolledCoursesData> {
    return await this.repository.course.getEnrolledCourses(resourceId, query);
  }

  public async updateBasicCourse(
    courseId: number,
    resourceId: CourseResourceId,
    dto: UpdateBasicCourseDto,
  ): Promise<CourseModel> {
    return await this.repository.course.updateCourse(courseId, resourceId, dto);
  }

  public async updateCourseStatus(
    courseId: number,
    resourceId: CourseResourceId,
    dto: UpdateCourseStatusDto,
  ): Promise<CourseModel> {
    return await this.repository.course.updateCourse(courseId, resourceId, dto);
  }

  public async updateCourseCategoryId(
    courseId: number,
    resourceId: CourseResourceId,
    dto: UpdateCourseCategoryIdDto,
  ): Promise<CourseModel> {
    try {
      return await this.repository.course.updateCourse(
        courseId,
        resourceId,
        dto,
      );
    } catch (error: any) {
      throw handleRepositoryError(error, {
        foreignConstraint: {
          default: { message: "Category doesn't exist!" },
        },
      });
    }
  }

  public async updateCourseCode(
    courseId: number,
    resourceId: CourseResourceId,
    dto: UpdateCourseCodeDto,
  ): Promise<CourseModel> {
    try {
      return await this.repository.course.updateCourse(
        courseId,
        resourceId,
        dto,
      );
    } catch (error: any) {
      throw handleRepositoryError(error, {
        uniqueConstraint: {
          default: {
            message: "code is already taken!",
          },
        },
      });
    }
  }

  public async deleteCourse(
    courseId: number,
    resourceId: CourseResourceId,
  ): Promise<{}> {
    await this.repository.course.deleteCourse(courseId, resourceId);

    return {};
  }

  public async createLike(
    resourceId: CourseLikeResourceId,
  ): Promise<CourseLikeModel> {
    try {
      return await this.repository.course.createLike(resourceId);
    } catch (error: any) {
      throw handleRepositoryError(error, {
        uniqueConstraint: {
          default: { message: "Like already exists!" },
        },
      });
    }
  }

  public async deleteLike(
    likeId: number,
    resourceId: CourseLikeResourceId,
  ): Promise<{}> {
    await this.validateRelationBetweenResources({
      likeId,
      resourceId,
    });
    await this.repository.course.deleteLike(likeId, resourceId);

    return {};
  }

  public async validateRelationBetweenResources(id: {
    likeId: number;
    resourceId: CourseLikeResourceId;
  }): Promise<CourseLikeModel | null> {
    const { likeId, resourceId } = id;
    const {
      courseId,
      user: { id: userId, role },
    } = resourceId;

    const { isAdmin } = getRoleStatus(role);
    const like = await this.repository.course.getLikeById(likeId, resourceId);
    if (!like || like.courseId !== courseId) {
      if (!isAdmin) {
        throw new AuthorizationException();
      }

      if (!like) {
        throw new RecordNotFoundException("like doesn't exist!");
      }

      if (like.courseId !== courseId) {
        throw new ClientException("course_likeId doesn't match likeId!");
      }
    }

    return like;
  }
}
