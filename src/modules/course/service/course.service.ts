import { inject, injectable } from "inversify";
import { CourseModel } from "../course.type";
import { CreateCourseDto, UpdateCourseDto } from "../course.type";
import { CourseDITypes } from "../course.type";
import { getValuable } from "../../../common/functions/getValuable";
import { ICourseRepository } from "../repository/course.repository";
import { Role } from "@prisma/client";

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
  getAllCourses: (
    userId: string,
    role: Role
  ) => Promise<CourseModel[]>;
  getOneCourse: (
    userId: string,
    role: Role,
    courseId: string
  ) => Promise<CourseModel>;
  getAllOwnedCourses: (userId: string) => Promise<CourseModel[]>;
}

@injectable()
export class CourseService implements ICourseService {
  @inject(CourseDITypes.COURSE_REPOSITORY) courseRepository: ICourseRepository;

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

  public async getAllCourses(
    userId: string,
    role: Role
  ): Promise<CourseModel[]> {
    try {
      const courses = await this.courseRepository.getAllCourses(userId, role);

      const nonNullCourses = courses.map(
        (course) => getValuable(course) as CourseModel
      );

      return nonNullCourses;
    } catch (error) {
      throw error;
    }
  }

  public async getOneCourse(userId: string, role: Role, courseId: string): Promise<CourseModel> {
    try {
      const course = await this.courseRepository.getOneCourse(userId, role, courseId);

      return getValuable(course)
    } catch (error) {
      throw error
    }
  }

  public async getAllOwnedCourses(userId: string): Promise<CourseModel[]> {
    try {
      const courses = await this.courseRepository.getAllOwnedCourses(userId);

      const nonNullCourses = courses.map(
        (course) => getValuable(course) as CourseModel
      );

      return nonNullCourses;
    } catch (error) {
      throw error;
    }
  }
}
