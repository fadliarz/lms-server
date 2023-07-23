import { inject, injectable } from "inversify";
import { CourseModel } from "../course.type";
import { CreateCourseDto, UpdateCourseDto } from "../course.type";
import { CourseDITypes } from "../course.type";
import { getValuable } from "../../../common/functions/getValuable";
import { ICourseRepository } from "../repository/course.repository";

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
}
