import { inject, injectable } from "inversify";
import {
  CourseModel,
  GetCourseByIdQuery,
  GetCoursesQuery,
  EnrolledCourseModel,
  CourseLikeResourceId,
  CourseLikeModel,
  GetEnrolledCourseByIdQuery,
  GetEnrolledCoursesQuery,
} from "../course.type";
import { CreateCourseDto, UpdateCourseDto } from "../course.type";
import { CourseDITypes } from "../course.type";
import getValuable from "../../../common/functions/getValuable";
import { ICourseRepository } from "../repository/course.repository";

import "reflect-metadata";

export interface ICourseService {
  createCourse: (userId: number, dto: CreateCourseDto) => Promise<CourseModel>;
  getCourseById: (
    courseId: number,
    query: GetCourseByIdQuery
  ) => Promise<CourseModel>;
  getCourses: (query: GetCoursesQuery) => Promise<CourseModel[]>;
  getEnrolledCourseById: (
    userId: number,
    courseId: number,
    query: GetEnrolledCourseByIdQuery
  ) => Promise<CourseModel>;
  getEnrolledCourses: (
    userId: number,
    query: GetEnrolledCoursesQuery
  ) => Promise<EnrolledCourseModel[]>;
  updateCourse: (
    courseId: number,
    dto: UpdateCourseDto
  ) => Promise<CourseModel>;
  deleteCourse: (courseId: number) => Promise<{}>;
  createLike: (
    userId: number,
    resourceId: CourseLikeResourceId
  ) => Promise<CourseLikeModel>;
  deleteLike: (resourceId: CourseLikeResourceId) => Promise<{}>;
}

@injectable()
export class CourseService implements ICourseService {
  @inject(CourseDITypes.REPOSITORY)
  private readonly repository: ICourseRepository;

  public async createCourse(
    userId: number,
    dto: CreateCourseDto
  ): Promise<CourseModel> {
    const newCourse = await this.repository.createCourse(userId, dto);

    return getValuable(newCourse);
  }

  public async getCourseById(
    courseId: number,
    query: GetCourseByIdQuery
  ): Promise<CourseModel> {
    let course = await this.repository.getCourseById(courseId, query);

    return getValuable(course);
  }

  public async getCourses(query: GetCoursesQuery): Promise<CourseModel[]> {
    const courses = await this.repository.getCourses(query);
    const valuableCourses = courses.map((course) => {
      return getValuable(course) satisfies CourseModel;
    });

    return valuableCourses;
  }

  public async getEnrolledCourseById(
    userId: number,
    courseId: number,
    query: GetEnrolledCourseByIdQuery
  ): Promise<CourseModel> {
    const enrolledCourse = await this.repository.getEnrolledCourseById(
      userId,
      courseId,
      query
    );

    return getValuable(enrolledCourse);
  }

  public async getEnrolledCourses(
    userId: number,
    query: GetEnrolledCoursesQuery
  ): Promise<EnrolledCourseModel[]> {
    const enrolledCourses = await this.repository.getEnrolledCourses(
      userId,
      query
    );
    const valuableEnrolledCourses = enrolledCourses.map((enrolledCourse) => {
      enrolledCourse.course = getValuable(
        enrolledCourse.course
      ) satisfies CourseModel;
      return enrolledCourse;
    });

    return valuableEnrolledCourses;
  }

  public async updateCourse(
    courseId: number,
    dto: UpdateCourseDto
  ): Promise<CourseModel> {
    const updatedCourse = await this.repository.updateCourse(courseId, dto);

    return getValuable(updatedCourse);
  }

  public async deleteCourse(courseId: number): Promise<{}> {
    await this.repository.deleteCourse(courseId);

    return {};
  }

  public async createLike(
    userId: number,
    resourceId: CourseLikeResourceId
  ): Promise<CourseLikeModel> {
    const newLike = await this.repository.createLike(userId, resourceId);

    return getValuable(newLike);
  }

  public async deleteLike(resourceId: CourseLikeResourceId): Promise<{}> {
    await this.repository.deleteLike(resourceId);

    return {};
  }
}
