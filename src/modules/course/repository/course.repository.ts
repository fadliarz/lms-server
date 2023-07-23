import { CreateCourseDto, UpdateCourseDto } from "../course.type";
import { Course, PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { injectable } from "inversify";
import { StatusCode } from "../../../common/constants/statusCode";
import HttpException from "../../../common/exceptions/HttpException";

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
}

@injectable()
export class CourseRepository implements ICourseRepository {
  private courseTable = new PrismaClient().course;

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
}
