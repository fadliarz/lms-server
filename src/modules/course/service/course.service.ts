import "reflect-metadata";
import { inject, injectable } from "inversify";
import {
  CourseModel,
  GetCourseByIdQuery,
  GetCoursesQuery,
  EnrolledCourseModel,
  CourseLikeResourceId,
  CourseLikeModel,
  GetEnrolledCoursesQuery,
  CourseResourceId,
  UpdateBasicCourseDto,
  GetCourseByIdData,
  GetEnrolledCoursesData,
  UpdateCourseCategoryIdDto,
  UpdateCourseStatusDto,
  GetCoursesData,
} from "../course.type";
import { CreateCourseDto, UpdateCourseDto } from "../course.type";
import { CourseDITypes } from "../course.type";
import { ICourseRepository } from "../repository/course.repository";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import {
  CourseLessonModel,
  CourseLessonResourceId,
} from "../../lesson/lesson.type";
import {
  IRepository,
  RepositoryDITypes,
} from "../../../common/class/repository/repository.type";

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

@injectable()
export class CourseService implements ICourseService {
  @inject(RepositoryDITypes.FACADE)
  private readonly repository: IRepository;

  public async createCourse(
    resourceId: CourseResourceId,
    dto: CreateCourseDto,
  ): Promise<CourseModel> {
    return await this.repository.course.createCourse(resourceId, dto);
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
    return await this.repository.course.updateCourse(courseId, resourceId, dto);
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
    return await this.repository.course.createLike(resourceId);
  }

  public async deleteLike(
    likeId: number,
    resourceId: CourseLikeResourceId,
  ): Promise<{}> {
    await this.validateRelationBetweenResources(
      {
        likeId,
        resourceId,
      },
      new RecordNotFoundException(),
    );
    await this.repository.course.deleteLike(likeId, resourceId);

    return {};
  }

  public async validateRelationBetweenResources(
    id: {
      likeId: number;
      resourceId: CourseLikeResourceId;
    },
    error?: Error,
  ): Promise<CourseLikeModel | null> {
    const { likeId, resourceId } = id;
    const { courseId } = resourceId;

    const like = await this.repository.course.getLikeById(likeId, resourceId);

    if (!like || like.courseId !== courseId) {
      if (error) {
        throw error;
      }

      return null;
    }

    return like;
  }
}
