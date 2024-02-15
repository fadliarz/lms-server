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
} from "../course.type";
import { CreateCourseDto, UpdateCourseDto } from "../course.type";
import { CourseDITypes } from "../course.type";
import { ICourseRepository } from "../repository/course.repository";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import {
  CourseLessonModel,
  CourseLessonResourceId,
} from "../../lesson/lesson.type";

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
  // getCourses: (
  //   resourceId: CourseResourceId,
  //   query: GetCoursesQuery,
  // ) => Promise<GetCourseByIdData[]>;
  // getEnrolledCourses: (
  //   resourceId: CourseResourceId,
  //   query: GetEnrolledCoursesQuery,
  // ) => Promise<GetEnrolledCoursesData>;
  updateBasicCourse: (
    courseId: number,
    resourceId: CourseResourceId,
    dto: UpdateBasicCourseDto,
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
  @inject(CourseDITypes.REPOSITORY)
  private readonly repository: ICourseRepository;

  public async createCourse(
    resourceId: CourseResourceId,
    dto: CreateCourseDto,
  ): Promise<CourseModel> {
    return await this.repository.createCourse(resourceId, dto);
  }

  public async getCourseById(
    courseId: number,
    resourceId: CourseResourceId,
    query: GetCourseByIdQuery,
  ): Promise<GetCourseByIdData> {
    return await this.repository.getCourseByIdOrThrow(
      courseId,
      resourceId,
      query,
      new RecordNotFoundException(),
    );
  }

  // public async getCourses(
  //   resourceId: CourseResourceId,
  //   query: GetCoursesQuery,
  // ): Promise<GetCourseByIdData[]> {
  //   return await this.repository.getCourses(resourceId, query);
  // }
  //
  // public async getEnrolledCourses(
  //   resourceId: CourseResourceId,
  //   query: GetEnrolledCoursesQuery,
  // ): Promise<GetEnrolledCoursesData> {
  //   return await this.repository.getEnrolledCourses(resourceId, query);
  // }

  public async updateBasicCourse(
    courseId: number,
    resourceId: CourseResourceId,
    dto: UpdateBasicCourseDto,
  ): Promise<CourseModel> {
    return await this.repository.updateBasicCourse(courseId, resourceId, dto);
  }

  public async deleteCourse(
    courseId: number,
    resourceId: CourseResourceId,
  ): Promise<{}> {
    await this.repository.deleteCourse(courseId, resourceId);

    return {};
  }

  public async createLike(
    resourceId: CourseLikeResourceId,
  ): Promise<CourseLikeModel> {
    return await this.repository.createLike(resourceId);
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
    await this.repository.deleteLike(likeId, resourceId);

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

    const like = await this.repository.getLikeById(likeId, resourceId);

    if (!like || like.courseId !== courseId) {
      if (error) {
        throw error;
      }

      return null;
    }

    return like;
  }
}
