import {
  CreateCourseDto,
  Enroller,
  GetCourseQuery,
  UpdateCourseDto,
} from "../course.type";
import { Course, PrismaClient, Role } from "@prisma/client";
import { injectable } from "inversify";
import { handlePrismaError } from "../../../common/exceptions/handlePrismaError";
import dIContainer from "../../../inversifyConfig";
import { databaseDITypes } from "../../../common/constants/databaseDITypes";
import { isEqualOrIncludeRole } from "../../../common/functions/isEqualOrIncludeRole";
import { processQuery } from "../../../common/functions/processQuery";

export interface ICourseRepository {
  isLiked: (userId: number, courseId: number) => Promise<boolean>;
  deleteCourseLike: (
    userId: number,
    courseId: number
  ) => Promise<Pick<Course, "totalLikes">>;
  createCourseLike: (
    userId: number,
    courseId: number
  ) => Promise<Pick<Course, "totalLikes">>;
  deleteCourse: (courseId: number) => Promise<Course>;
  updateCourse: (
    courseId: number,
    courseDetails: UpdateCourseDto
  ) => Promise<Course>;
  getCourseEnrollers: (
    courseId: number,
    include: {
      students?: boolean;
      instructors?: boolean;
    }
  ) => Promise<{
    students?: Enroller[];
    instructors?: Enroller[];
  }>;
  getEnrolledCourses: (
    userId: number,
    role: Role | Role[]
  ) => Promise<{ role: Role; course: Course }[]>;
  getCourseById: (courseId: number, query: GetCourseQuery) => Promise<Course>;
  getOwnedCourses: (userId: number) => Promise<Course[]>;
  createCourse: (
    userId: number,
    courseDetails: CreateCourseDto
  ) => Promise<Course>;
}

@injectable()
export class CourseRepository implements ICourseRepository {
  private readonly prisma = dIContainer.get<PrismaClient>(
    databaseDITypes.PRISMA_CLIENT
  );
  private readonly courseTable = this.prisma.course;
  private readonly courseEnrollmentTable = this.prisma.courseEnrollment;
  private readonly courseLikeTable = this.prisma.courseLike;

  public async isLiked(userId: number, courseId: number) {
    const like = await this.courseLikeTable.findUnique({
      where: {
        courseId_userId: {
          userId,
          courseId,
        },
      },
      select: {
        id: true,
      },
    });

    return like ? true : false;
  }

  public async deleteCourseLike(
    userId: number,
    courseId: number
  ): Promise<Pick<Course, "totalLikes">> {
    try {
      const like = await this.prisma.$transaction(async (tx) => {
        const [updatedCourse] = await Promise.all([
          tx.course.update({
            where: {
              id: courseId,
            },
            data: {
              totalLikes: { decrement: 1 },
            },
            select: {
              totalLikes: true,
            },
          }),
          tx.courseLike.delete({
            where: {
              courseId_userId: {
                courseId,
                userId,
              },
            },
            select: {
              id: true,
            },
          }),
        ]);

        return updatedCourse;
      });

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
      const like = await this.prisma.$transaction(async (tx) => {
        const [updatedCourse] = await Promise.all([
          tx.course.update({
            where: {
              id: courseId,
            },
            data: {
              totalLikes: { increment: 1 },
            },
            select: {
              totalLikes: true,
            },
          }),
          tx.courseLike.create({
            data: {
              courseId,
              userId,
            },
            select: {
              id: true,
            },
          }),
        ]);

        return updatedCourse;
      });

      return like;
    } catch (error) {
      throw error;
    }
  }

  public async deleteCourse(courseId: number): Promise<Course> {
    try {
      const deletedCourse = await this.courseTable.delete({
        where: { id: courseId },
      });

      return deletedCourse;
    } catch (error) {
      throw error;
    }
  }

  public async updateCourse(
    courseId: number,
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
  public async getCourseEnrollers(
    courseId: number,
    include: {
      students?: boolean;
      instructors?: boolean;
    }
  ): Promise<{
    students?: Enroller[];
    instructors?: Enroller[];
  }> {
    const enrollments = await this.courseEnrollmentTable.findMany({
      where: {
        courseId,
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
        role: true,
      },
    });

    const students: Enroller[] = [];
    const instructors: Enroller[] = [];

    enrollments.forEach((enrollment) => {
      if (
        include.students &&
        isEqualOrIncludeRole(enrollment.role, Role.STUDENT)
      ) {
        students.push(enrollment.user);
      }

      if (
        include.instructors &&
        isEqualOrIncludeRole(enrollment.role, Role.INSTRUCTOR)
      ) {
        instructors.push(enrollment.user);
      }
    });

    let returnValue = {};

    if (include.students) {
      returnValue = { ...returnValue, students };
    }

    if (include.instructors) {
      returnValue = { ...returnValue, instructors };
    }

    return returnValue;
  }

  public async getCourseById(
    courseId: number,
    query: GetCourseQuery
  ): Promise<Course> {
    try {
      const { include_author, include_lessons } = processQuery(query);
      let course = await this.courseTable.findUniqueOrThrow({
        where: {
          id: courseId,
        },
        include: {
          author: include_author
            ? {
                select: {
                  id: true,
                  profile: {
                    select: {
                      name: true,
                      NIM: true,
                    },
                  },
                },
              }
            : undefined,
          lessons: include_lessons,
        },
      });

      return course;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  public async getEnrolledCourses(
    userId: number,
    role: Role | Role[]
  ): Promise<{ role: Role; course: Course }[]> {
    try {
      const courseEnrollments = await this.courseEnrollmentTable.findMany({
        where: {
          userId,
          role: {
            in: role,
          },
        },
        select: {
          course: true,
          role: true,
        },
      });

      return courseEnrollments;
    } catch (error) {
      throw error;
    }
  }

  public async getOwnedCourses(userId: number): Promise<Course[]> {
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

  public async createCourse(
    userId: number,
    courseDetails: CreateCourseDto
  ): Promise<Course> {
    try {
      const course = await this.courseTable.create({
        data: {
          ...courseDetails,

          authorId: userId,
        },
      });

      return course;
    } catch (error) {
      throw error;
    }
  }
}
