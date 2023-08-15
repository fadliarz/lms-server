import { inject, injectable } from "inversify";
import {
  CourseModel,
  GetCourseQuery,
  GetCourseByIdDto,
  GetCoursesQuery,
} from "../course.type";
import { CreateCourseDto, UpdateCourseDto } from "../course.type";
import { CourseDITypes } from "../course.type";
import { getValuable } from "../../../common/functions/getValuable";
import { ICourseRepository } from "../repository/course.repository";
import { Course, Role } from "@prisma/client";
import { processQuery } from "../../../common/functions/processQuery";
import { isEqualOrIncludeRole } from "../../../common/functions/isEqualOrIncludeRole";
import { ClientException } from "../../../common/exceptions/ClientException";

export interface ICourseService {
  deleteCourseLike: (
    userId: number,
    courseId: number
  ) => Promise<Pick<Course, "totalLikes">>;
  createCourseLike: (
    userId: number,
    courseId: number
  ) => Promise<Pick<Course, "totalLikes">>;
  deleteCourse: (courseId: number) => Promise<CourseModel>;
  createCourse: (
    userId: number,
    courseDetails: CreateCourseDto
  ) => Promise<CourseModel>;
  updateCourse: (
    courseId: number,
    courseDetails: UpdateCourseDto
  ) => Promise<CourseModel>;
  getCourseById: (
    courseId: number,
    query: GetCourseQuery
  ) => Promise<GetCourseByIdDto>;
  getCourses: (
    userId: number,
    query: GetCoursesQuery
  ) => Promise<{
    ownedCourses?: Course[];
    studentCourses?: Course[];
    instructorCourses?: Course[];
  }>;
}

@injectable()
export class CourseService implements ICourseService {
  @inject(CourseDITypes.REPOSITORY)
  private readonly courseRepository: ICourseRepository;

  public async deleteCourseLike(
    userId: number,
    courseId: number
  ): Promise<Pick<Course, "totalLikes">> {
    try {
      const isLiked = await this.courseRepository.isLiked(userId, courseId);

      if (!isLiked) {
        throw new ClientException();
      }

      const like = await this.courseRepository.createCourseLike(
        userId,
        courseId
      );

      return like;
    } catch (error) {
      throw error;
    }
  }

  public async createCourseLike(
    userId: number,
    courseId: number
  ): Promise<Pick<Course, "totalLikes">> {
    try {
      const isLiked = await this.courseRepository.isLiked(userId, courseId);

      if (isLiked) {
        throw new ClientException();
      }

      const like = await this.courseRepository.createCourseLike(
        userId,
        courseId
      );

      return like;
    } catch (error) {
      throw error;
    }
  }

  public async deleteCourse(courseId: number): Promise<CourseModel> {
    try {
      const deletedCourse = await this.courseRepository.deleteCourse(courseId);

      return getValuable(deletedCourse);
    } catch (error) {
      throw error;
    }
  }

  public async createCourse(
    userId: number,
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
    courseId: number,
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

  public async getCourseById(
    courseId: number,
    query: GetCourseQuery
  ): Promise<GetCourseByIdDto> {
    try {
      let course = (await this.courseRepository.getCourseById(
        courseId,
        query
      )) as GetCourseByIdDto;

      const { include_instructors, include_students } = processQuery(query);

      if (include_students || include_instructors) {
        const { students, instructors } =
          await this.courseRepository.getCourseEnrollers(courseId, {
            students: include_students,
            instructors: include_instructors,
          });

        if (students) {
          course = { ...course, students };
        }

        if (instructors) {
          course = { ...course, instructors };
        }
      }

      return course;
    } catch (error) {
      throw error;
    }
  }

  public async getCourses(
    userId: number,
    query: GetCoursesQuery
  ): Promise<{
    ownedCourses?: Course[];
    studentCourses?: Course[];
    instructorCourses?: Course[];
  }> {
    try {
      const {
        include_owned,
        include_student_course,
        include_instructor_course,
      } = processQuery(query);

      let courses: {
        ownedCourses?: Course[];
        studentCourses?: Course[];
        instructorCourses?: Course[];
      } = {};

      if (include_owned) {
        const ownedCourses = await this.courseRepository.getOwnedCourses(
          userId
        );

        courses.ownedCourses = ownedCourses;
      }

      const roles: Role[] = [];
      if (include_student_course) {
        roles.push(Role.STUDENT);
      }

      if (include_instructor_course) {
        roles.push(Role.INSTRUCTOR);
      }

      let studentCourses: Course[] = [];
      let instructorCourses: Course[] = [];

      if (roles.length > 0) {
        const enrolledCourses = await this.courseRepository.getEnrolledCourses(
          userId,
          roles
        );

        enrolledCourses.forEach((enrolledCourse) => {
          if (isEqualOrIncludeRole(enrolledCourse.role, Role.STUDENT)) {
            studentCourses.push(enrolledCourse.course);
          }

          if (isEqualOrIncludeRole(enrolledCourse.role, Role.INSTRUCTOR)) {
            instructorCourses.push(enrolledCourse.course);
          }
        });
      }

      if (include_student_course) {
        courses.studentCourses = studentCourses;
      }

      if (include_instructor_course) {
        courses.instructorCourses = instructorCourses;
      }

      return courses;
    } catch (error) {
      throw error;
    }
  }
}
