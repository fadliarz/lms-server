import { inject, injectable } from "inversify";
import { CourseModel, GetOneCourse, GetOneCourseQuery } from "../course.type";
import { CreateCourseDto, UpdateCourseDto } from "../course.type";
import { CourseDITypes } from "../course.type";
import { getValuable } from "../../../common/functions/getValuable";
import { ICourseRepository } from "../repository/course.repository";
import { Course, Role } from "@prisma/client";
import { CourseLessonModel } from "../../lesson/lesson.type";

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
  getAllCourses: (userId: string, role: Role) => Promise<CourseModel[]>;
  getOneCourse: (
    courseId: string,
    query: GetOneCourseQuery
  ) => Promise<GetOneCourse>;
  getAllOwnedCourses: (userId: string) => Promise<CourseModel[]>;
  setLike: (
    userId: string,
    courseId: string
  ) => Promise<Pick<Course, "totalLikes">>;
  getCourseLessonsById: (courseId: string) => Promise<CourseLessonModel[]>;
}

@injectable()
export class CourseService implements ICourseService {
  @inject(CourseDITypes.COURSE_REPOSITORY) private readonly courseRepository: ICourseRepository;

  public async getCourseLessonsById(
    courseId: string
  ): Promise<CourseLessonModel[]> {
    try {
      const lessons = await this.courseRepository.getCourseLessonsById(
        courseId
      );

      return getValuable(lessons);
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

      return getValuable(courses) as CourseModel[];
    } catch (error) {
      throw error;
    }
  }

  public async getOneCourse(
    userId: string,
    query: GetOneCourseQuery
  ): Promise<GetOneCourse> {
    try {
      const course = await this.courseRepository.getCourseById(userId, query);

      return getValuable(course);
    } catch (error) {
      throw error;
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
