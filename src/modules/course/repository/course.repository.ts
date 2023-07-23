import { CreateCourseDto, UpdateCourseDto } from "../course.type";
import { Course, PrismaClient, Role } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { injectable } from "inversify";
import { StatusCode } from "../../../common/constants/statusCode";
import HttpException from "../../../common/exceptions/HttpException";
import { RecordNotFoundException } from "../../../common/exceptions/RecordNotFoundException";
import { handlePrismaError } from "../../../common/exceptions/handlePrismaError";

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
  getOneCourse: (
    userId: string,
    role: Role,
    courseId: string
  ) => Promise<Course>;
  getAllOwnedCourses: (userId: string) => Promise<Course[]>;
}

@injectable()
export class CourseRepository implements ICourseRepository {
  private courseTable = new PrismaClient().course;
  private courseEnrollmentTable = new PrismaClient().courseEnrollment;

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
      const course = await this.courseTable.findFirst({
        where: {
          id: courseId,
          authorId: userId,
        },
      });

      if (!course) {
        throw new HttpException(StatusCode.NOT_FOUND, "Course not found!");
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
      const courses = await this.courseTable.findMany({
        where: {
          courseEnrollments: {
            some: {
              userId,
              role,
            },
          },
        },
      });

      return courses;
    } catch (error) {
      throw error;
    }
  }

  public async getOneCourse(
    userId: string,
    role: Role,
    courseId: string
  ): Promise<Course> {
    try {
      const courseEnrollment =
        await new PrismaClient().courseEnrollment.findUniqueOrThrow({
          where: {
            userId_courseId: {
              userId,
              courseId,
            },
          },
        });

      const course = await this.courseTable.findUniqueOrThrow({
        where: {
          id: courseEnrollment.courseId,
        },
      });

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
