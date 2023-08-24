import { inject, injectable } from "inversify";
import {
  CourseModel,
  GetCourseQuery,
  GetCourseByIdDto,
  GetCoursesQuery,
} from "../course.type";
import { CreateCourseDto, UpdateCourseDto } from "../course.type";
import { CourseDITypes } from "../course.type";
import getValuable from "../../../common/functions/getValuable";
import { ICourseRepository } from "../repository/course.repository";
import { Course, Role } from "@prisma/client";
import processQuery from "../../../common/functions/processQuery";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
import ClientException from "../../../common/exceptions/ClientException";

export interface ICourseService {
  // deleteLike: (
  //   userId: number,
  //   courseId: number
  // ) => Promise<Pick<Course, "totalLikes">>;
  // createLike: (
  //   userId: number,
  //   courseId: number
  // ) => Promise<Pick<Course, "totalLikes">>;
  delete: (courseId: number) => Promise<CourseModel>;
  create: (
    userId: number,
    courseDetails: CreateCourseDto
  ) => Promise<CourseModel>;
  update: (
    courseId: number,
    courseDetails: UpdateCourseDto
  ) => Promise<CourseModel>;
  // getById: (
  //   courseId: number,
  //   query: GetCourseQuery
  // ) => Promise<GetCourseByIdDto>;
  // getMany: (
  //   userId: number,
  //   query: GetCoursesQuery
  // ) => Promise<{
  //   ownedCourses?: Course[];
  //   studentCourses?: Course[];
  //   instructorCourses?: Course[];
  // }>;
}

@injectable()
export class CourseService implements ICourseService {
  @inject(CourseDITypes.REPOSITORY)
  private readonly repository: ICourseRepository;

  // public async deleteLike(
  //   userId: number,
  //   courseId: number
  // ): Promise<Pick<Course, "totalLikes">> {
  //   try {
  //     const isLiked = await this.repository.isLiked(userId, courseId);

  //     if (!isLiked) {
  //       throw new ClientException();
  //     }

  //     const like = await this.repository.deleteLike(userId, courseId);

  //     return like;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // public async createLike(
  //   userId: number,
  //   courseId: number
  // ): Promise<Pick<Course, "totalLikes">> {
  //   try {
  //     const isLiked = await this.repository.isLiked(userId, courseId);

  //     if (isLiked) {
  //       throw new ClientException();
  //     }

  //     const like = await this.repository.createLike(userId, courseId);

  //     return like;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  public async delete(courseId: number): Promise<CourseModel> {
    try {
      const deletedCourse = await this.repository.delete(courseId);

      return getValuable(deletedCourse);
    } catch (error) {
      throw error;
    }
  }

  public async create(
    userId: number,
    courseDetails: CreateCourseDto
  ): Promise<CourseModel> {
    try {
      const course = await this.repository.create(userId, courseDetails);

      return getValuable(course);
    } catch (error) {
      throw error;
    }
  }

  public async update(
    courseId: number,
    courseDetails: UpdateCourseDto
  ): Promise<CourseModel> {
    try {
      const course = await this.repository.update(courseId, courseDetails);

      return getValuable(course);
    } catch (error) {
      throw error;
    }
  }

  // public async getById(
  //   courseId: number,
  //   query: GetCourseQuery
  // ): Promise<GetCourseByIdDto> {
  //   try {
  //     let course = (await this.repository.getById(
  //       courseId,
  //       query
  //     )) as GetCourseByIdDto;

  //     const { include_instructors, include_students, include_author } =
  //       processQuery(query);

  //     if (include_students || include_instructors) {
  //       const { students, instructors } =
  //         await this.repository.getManyCourseEnrollers(courseId, {
  //           students: include_students,
  //           instructors: include_instructors,
  //         });

  //       if (students) {
  //         course = { ...course, students };
  //       }

  //       if (instructors) {
  //         course = { ...course, instructors };
  //       }
  //     }

  //     if (include_author) {
  //       const author = await this.repository.getAuthor(courseId);

  //       course = { ...course, author };
  //     }

  //     return course;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // public async getMany(
  //   userId: number,
  //   query: GetCoursesQuery
  // ): Promise<{
  //   ownedCourses?: Course[];
  //   studentCourses?: Course[];
  //   instructorCourses?: Course[];
  // }> {
  //   try {
  //     const {
  //       include_owned,
  //       include_student_course,
  //       include_instructor_course,
  //     } = processQuery(query);

  //     let courses: {
  //       ownedCourses?: Course[];
  //       studentCourses?: Course[];
  //       instructorCourses?: Course[];
  //     } = {};

  //     if (include_owned) {
  //       const ownedCourses = await this.repository.getManyOwnedCourses(userId);

  //       courses.ownedCourses = ownedCourses;
  //     }

  //     const roles: Role[] = [];
  //     if (include_student_course) {
  //       roles.push(Role.STUDENT);
  //     }

  //     if (include_instructor_course) {
  //       roles.push(Role.INSTRUCTOR);
  //     }

  //     let studentCourses: Course[] = [];
  //     let instructorCourses: Course[] = [];

  //     if (roles.length > 0) {
  //       const enrolledCourses = await this.repository.getManyEnrolledCourses(
  //         userId,
  //         roles
  //       );

  //       enrolledCourses.forEach((enrolledCourse) => {
  //         if (isEqualOrIncludeRole(enrolledCourse.role, Role.STUDENT)) {
  //           studentCourses.push(enrolledCourse.course);
  //         }

  //         if (isEqualOrIncludeRole(enrolledCourse.role, Role.INSTRUCTOR)) {
  //           instructorCourses.push(enrolledCourse.course);
  //         }
  //       });
  //     }

  //     if (include_student_course) {
  //       courses.studentCourses = studentCourses;
  //     }

  //     if (include_instructor_course) {
  //       courses.instructorCourses = instructorCourses;
  //     }

  //     return courses;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
