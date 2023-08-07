import {
  CreateCourseDto,
  Enroller,
  GetCourseQuery,
  GetCoursesQuery,
  GetOneCourse,
  UpdateCourseDto,
} from "../course.type";
import { Course, CourseLesson, PrismaClient, Role, User } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { injectable } from "inversify";
import { StatusCode } from "../../../common/constants/statusCode";
import HttpException from "../../../common/exceptions/HttpException";
import { handlePrismaError } from "../../../common/exceptions/handlePrismaError";
import { AuthorizationException } from "../../../common/exceptions/AuthorizationException";

export interface ICourseRepository {
  getUserRoleInCourseOrThrow: (
    userId: string,
    courseId: string
  ) => Promise<Role>;
  createCourse: (
    userId: string,
    courseDetails: CreateCourseDto
  ) => Promise<Course>;
  updateCourse: (
    userId: string,
    courseId: string,
    courseDetails: UpdateCourseDto
  ) => Promise<Course>;
  getEnrolledCourses: (
    userId: string,
    query: GetCoursesQuery
  ) => Promise<Course[]>;
  getCourseById: (
    courseId: string,
    query: GetCourseQuery
  ) => Promise<GetOneCourse>;
  getOwnedCourses: (userId: string) => Promise<Course[]>;
  setLike: (
    userId: string,
    courseId: string
  ) => Promise<Pick<Course, "totalLikes">>;
}

@injectable()
export class CourseRepository implements ICourseRepository {
  private courseTable = new PrismaClient().course;
  private courseEnrollmentTable = new PrismaClient().courseEnrollment;
  private courseLikeTable = new PrismaClient().courseLike;
  private userTable = new PrismaClient().user;

  private async getCourseEnrollers(
    courseId: string,
    role: Role
  ): Promise<Enroller[]> {
    const enrollments = await this.courseEnrollmentTable.findMany({
      where: {
        courseId,
        role: role,
      },
      select: {
        user: {
          select: {
            id: true,
            profile: {
              select: {
                name: true,
                NIM: true,
              },
            },
          },
        },
      },
    });

    const enrollers = enrollments.map((enrollment) => {
      return enrollment.user;
    });

    return enrollers;
  }

  public async getUserRoleInCourseOrThrow(
    userId: string,
    courseId: string
  ): Promise<Role> {
    try {
      const { role } = await this.courseEnrollmentTable.findUniqueOrThrow({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        select: {
          role: true,
        },
      });

      return role;
    } catch (error) {
      throw error;
    }
  }

  public async createCourse(
    userId: string,
    courseDetails: CreateCourseDto
  ): Promise<Course> {
    try {
      const course = await this.courseTable.create({
        data: {
          ...courseDetails,
          id: uuidv4(),
          authorId: userId,
        },
      });

      return course;
    } catch (error) {
      throw error;
    }
  }

  public async updateCourse(
    userId: string,
    courseId: string,
    courseDetails: UpdateCourseDto
  ): Promise<Course> {
    try {
      const course = await this.courseTable.findUnique({
        where: {
          id: courseId,
        },
        select: {
          authorId: true,
        },
      });

      if (!course) {
        throw new HttpException(StatusCode.NOT_FOUND, "Course not found!");
      }

      if (userId !== course.authorId) {
        throw new AuthorizationException();
      }

      const updatedCourse = await this.courseTable.update({
        where: { id: courseId },
        data: courseDetails,
      });

      return updatedCourse;
    } catch (error: any) {
      throw error;
    }
  }

  public async getEnrolledCourses(
    userId: string,
    query: GetCoursesQuery
  ): Promise<Course[]> {
    try {
      const courseEnrollments = await this.courseEnrollmentTable.findMany({
        where: {
          userId,
          role: query.role,
        },
        select: {
          course: true,
        },
      });

      const courses = courseEnrollments.map((courseEnrollments) => {
        return courseEnrollments.course;
      });

      return courses;
    } catch (error) {
      throw error;
    }
  }

  public async getCourseById(
    courseId: string,
    query: GetCourseQuery
  ): Promise<GetOneCourse> {
    try {
      let course = (await this.courseTable.findUniqueOrThrow({
        where: {
          id: courseId,
        },
        include: {
          author: {
            select: {
              id: true,
              profile: {
                select: {
                  name: true,
                  NIM: true,
                },
              },
            },
          },
          lessons: query.include_lessons
            ? /true/i.test(query.include_lessons)
            : false,
        },
      })) as GetOneCourse;

      if (
        query.include_students ? /true/i.test(query.include_students) : false
      ) {
        const students = await this.getCourseEnrollers(courseId, Role.STUDENT);

        course = { ...course, students };
      }

      if (
        query.include_instructors
          ? /true/i.test(query.include_instructors)
          : false
      ) {
        const instructors = await this.getCourseEnrollers(
          courseId,
          Role.INSTRUCTOR
        );

        course = { ...course, instructors };
      }

      return course;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  public async getOwnedCourses(userId: string): Promise<Course[]> {
    try {
      const courses = await this.courseTable.findMany({
        where: {
          authorId: userId,
        },
      });

      return courses;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  public async setLike(
    userId: string,
    courseId: string
  ): Promise<Pick<Course, "totalLikes">> {
    try {
      const courseLike = await this.courseLikeTable.findUniqueOrThrow({
        where: {
          courseId_userId: {
            courseId,
            userId,
          },
        },
      });

      const course = await this.courseTable.update({
        where: { id: courseId },
        data: { totalLikes: { [!courseLike ? "increment" : "decrement"]: 1 } },
      });

      return { totalLikes: course.totalLikes };
    } catch (error) {
      throw error;
    }
  }
}
