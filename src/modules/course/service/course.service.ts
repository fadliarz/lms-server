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
import { Course } from "@prisma/client";

export interface ICourseService {
  deleteCourse: (courseId: string) => Promise<CourseModel>;
  createCourse: (
    userId: string,
    courseDetails: CreateCourseDto
  ) => Promise<CourseModel>;
  updateCourse: (
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
    courseId: string
  ) => Promise<Pick<Course, "totalLikes">>;
}

@injectable()
export class CourseService implements ICourseService {
  @inject(CourseDITypes.COURSE_REPOSITORY)
  private readonly courseRepository: ICourseRepository;

  public async deleteCourse(courseId: string): Promise<CourseModel> {
    try {
      const deletedCourse = await this.courseRepository.deleteCourse(courseId);

      return getValuable(deletedCourse);
    } catch (error) {
      throw error;
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
    courseId: string,
    courseDetails: UpdateCourseDto
  ): Promise<CourseModel> {
    try {
      const course = await this.courseRepository.updateCourse(
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
    courseId: string
  ): Promise<Pick<Course, "totalLikes">> {
    try {
      return await this.courseRepository.setLike(userId, courseId);
    } catch (error) {
      throw error;
    }
  }
}
