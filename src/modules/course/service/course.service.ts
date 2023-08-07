import { inject, injectable } from "inversify";
import {
  CourseModel,
  GetCourseQuery,
  GetCoursesQuery,
  GetOneCourse,
} from "../course.type";
import { CreateCourseDto, UpdateCourseDto } from "../course.type";
import { CourseDITypes } from "../course.type";
import { getValuable } from "../../../common/functions/getValuable";
import { ICourseRepository } from "../repository/course.repository";
import { Course, Role } from "@prisma/client";
import { CourseLessonModel } from "../../lesson/lesson.type";
import { AuthorizationException } from "../../../common/exceptions/AuthorizationException";

export interface ICourseService {
  createCourse: (
    userId: string,
    courseDetails: CreateCourseDto
  ) => Promise<CourseModel>;
  updateCourse: (
    userId: string,
    courseId: string,
    courseDetails: UpdateCourseDto
  ) => Promise<CourseModel>;
  getEnrolledCourses: (
    userId: string,
    query: GetCoursesQuery
  ) => Promise<CourseModel[]>;
  getCourseById: (
    courseId: string,
    query: GetCourseQuery
  ) => Promise<GetOneCourse>;
  getOwnedCourses: (userId: string) => Promise<CourseModel[]>;
  setLike: (
    userId: string,
    role: Role,
    courseId: string
  ) => Promise<Pick<Course, "totalLikes">>;
}

@injectable()
export class CourseService implements ICourseService {
  @inject(CourseDITypes.COURSE_REPOSITORY)
  private readonly courseRepository: ICourseRepository;

  private async isEnrolledAndCanLikeOrThrow(
    userId: string,
    role: Role,
    courseId: string
  ) {
    const userRole = await this.courseRepository.getUserRoleInCourseOrThrow(
      userId,
      courseId
    );

    if (userRole.toString() !== role.toString()) {
      throw new AuthorizationException(
        "Unathorized! You are not allowed to like this course!"
      );
    }
  }

  public async createCourse(
    userId: string,
    courseDetails: CreateCourseDto
  ): Promise<CourseModel> {
    try {
      const course = await this.courseRepository.createCourse(
        userId,
        courseDetails
      );

      return getValuable(course);
    } catch (error) {
      throw error;
    }
  }

  public async updateCourse(
    userId: string,
    courseId: string,
    courseDetails: UpdateCourseDto
  ): Promise<CourseModel> {
    try {
      const course = await this.courseRepository.updateCourse(
        userId,
        courseId,
        courseDetails
      );

      return getValuable(course);
    } catch (error) {
      throw error;
    }
  }

  public async getEnrolledCourses(
    userId: string,
    query: GetCoursesQuery
  ): Promise<CourseModel[]> {
    try {
      const courses = await this.courseRepository.getEnrolledCourses(
        userId,
        query
      );

      return getValuable(courses) as CourseModel[];
    } catch (error) {
      throw error;
    }
  }

  public async getCourseById(
    userId: string,
    query: GetCourseQuery
  ): Promise<GetOneCourse> {
    try {
      const course = await this.courseRepository.getCourseById(userId, query);

      return getValuable(course);
    } catch (error) {
      throw error;
    }
  }

  public async getOwnedCourses(userId: string): Promise<CourseModel[]> {
    try {
      const courses = await this.courseRepository.getOwnedCourses(userId);

      return getValuable(courses);
    } catch (error) {
      throw error;
    }
  }

  public async setLike(
    userId: string,
    role: Role,
    courseId: string
  ): Promise<Pick<Course, "totalLikes">> {
    try {
      await this.isEnrolledAndCanLikeOrThrow(userId, role, courseId);

      return await this.courseRepository.setLike(userId, courseId);
    } catch (error) {
      throw error;
    }
  }
}
