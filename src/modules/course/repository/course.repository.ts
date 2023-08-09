import {
  CreateCourseDto,
  Enroller,
  GetCourseQuery,
  GetOneCourse,
  UpdateCourseDto,
} from "../course.type";
import { Course, PrismaClient, Role } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { injectable } from "inversify";

import { handlePrismaError } from "../../../common/exceptions/handlePrismaError";
import dIContainer from "../../../inversifyConfig";
import { databaseDITypes } from "../../../common/constants/databaseDITypes";

export interface ICourseRepository {
  deleteCourse: (courseId: string) => Promise<Course>;
  createCourse: (
    userId: string,
    courseDetails: CreateCourseDto
  ) => Promise<Course>;
  updateCourse: (
    courseId: string,
    courseDetails: UpdateCourseDto
  ) => Promise<Course>;
  getEnrolledCourses: (userId: string, role: Role) => Promise<Course[]>;
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
  private readonly prisma = dIContainer.get<PrismaClient>(
    databaseDITypes.PRISMA_CLIENT
  );
  private readonly courseTable = this.prisma.course;
  private readonly courseEnrollmentTable = this.prisma.courseEnrollment;
  private readonly courseLikeTable = this.prisma.courseLike;

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

  public async deleteCourse(courseId: string): Promise<Course> {
    try {
      const deletedCourse = await this.courseTable.delete({
        where: { id: courseId },
      });

      return deletedCourse;
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
    courseId: string,
    courseDetails: UpdateCourseDto
  ): Promise<Course> {
    try {
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
    role: Role
  ): Promise<Course[]> {
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
      const courseLike = await this.courseLikeTable.findUnique({
        where: {
          courseId_userId: {
            courseId,
            userId,
          },
        },
      });

      const course = await this.courseTable.update({
        where: { id: courseId },
        data: {
          totalLikes: { [!courseLike ? "increment" : "decrement"]: 1 },
          likes: !courseLike
            ? {
                create: {
                  id: uuidv4(),
                  userId,
                },
              }
            : undefined,
        },
      });

      return { totalLikes: course.totalLikes };
    } catch (error) {
      throw error;
    }
  }
}
