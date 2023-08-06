import {
  CreateCourseDto,
  Enroller,
  GetOneCourse,
  GetOneCourseQuery,
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
  createCourse: (
    userId: string,
    courseDetails: CreateCourseDto
  ) => Promise<Course>;
  updateCourse: (
    userId: string,
    courseId: string,
    courseDetails: UpdateCourseDto
  ) => Promise<Course>;
  getAllCourses: (userId: string, role: Role) => Promise<Course[]>;
  getCourseById: (
    courseId: string,
    query: GetOneCourseQuery
  ) => Promise<GetOneCourse>;
  getAllOwnedCourses: (userId: string) => Promise<Course[]>;
  setLike: (
    userId: string,
    courseId: string
  ) => Promise<Pick<Course, "totalLikes">>;
  getCourseLessonsById: (courseId: string) => Promise<CourseLesson[]>;
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

  public async getCourseLessonsById(courseId: string): Promise<CourseLesson[]> {
    try {
      const { lessons } = await this.courseTable.findUniqueOrThrow({
        where: {
          id: courseId,
        },
        select: {
          lessons: true,
        },
      });

      return lessons;
    } catch (error) {
      throw error;
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

  public async getAllCourses(userId: string, role: Role): Promise<Course[]> {
    try {
      const courseEnrollments = await this.courseEnrollmentTable.findMany({
        where: {
          userId,
          role,
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
    query: GetOneCourseQuery
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
        },
      })) as GetOneCourse;

      if (query.include_students) {
        const students = await this.getCourseEnrollers(courseId, Role.STUDENT);

        course = { ...course, students };
      }

      if (query.include_instructors) {
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

  public async getAllOwnedCourses(userId: string): Promise<Course[]> {
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
}
