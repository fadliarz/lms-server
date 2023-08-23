import {
  CreateCourseDto,
  Enroller,
  GetCourseQuery,
  UpdateCourseDto,
} from "../course.type";
import { Course, CourseLesson, Role, User } from "@prisma/client";
import { injectable } from "inversify";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
import processQuery from "../../../common/functions/processQuery";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";

export interface ICourseRepository {
  getAuthor: (courseId: number) => Promise<Enroller>;
  isLiked: (userId: number, courseId: number) => Promise<boolean>;
  deleteLike: (
    userId: number,
    courseId: number
  ) => Promise<Pick<Course, "totalLikes">>;
  createLike: (
    userId: number,
    courseId: number
  ) => Promise<Pick<Course, "totalLikes">>;
  delete: (courseId: number) => Promise<Course>;
  update: (courseId: number, courseDetails: UpdateCourseDto) => Promise<Course>;
  getManyCourseEnrollers: (
    courseId: number,
    include: {
      students?: boolean;
      instructors?: boolean;
    }
  ) => Promise<{
    students?: Enroller[];
    instructors?: Enroller[];
  }>;
  getManyEnrolledCourses: (
    userId: number,
    role: Role | Role[]
  ) => Promise<{ role: Role; course: Course }[]>;
  getById: (courseId: number, query: GetCourseQuery) => Promise<Course>;
  getManyOwnedCourses: (userId: number) => Promise<Course[]>;
  create: (userId: number, courseDetails: CreateCourseDto) => Promise<Course>;
}

@injectable()
export class CourseRepository implements ICourseRepository {
  private readonly prisma = PrismaClientSingleton.getInstance();
  private readonly courseTable = this.prisma.course;
  private readonly courseEnrollmentTable = this.prisma.courseEnrollment;
  private readonly courseLikeTable = this.prisma.courseLike;

  public async getAuthor(courseId: number) {
    const { author } = await this.courseTable.findUniqueOrThrow({
      where: { id: courseId },
      select: {
        author: {
          select: {
            id: true,
            name: true,
            NIM: true,
            avatar: true,
          },
        },
      },
    });

    return author;
  }

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

  public async deleteLike(
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

  public async createLike(
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

  public async delete(courseId: number): Promise<Course> {
    try {
      const deletedCourse = await this.prisma.$transaction(async (tx) => {
        let myCursor = -1;
        const { id: maxLessonId } = await tx.courseLesson.findFirstOrThrow({
          orderBy: {
            id: "desc",
          },
          select: { id: true },
        });

        let lesson: Pick<CourseLesson, "id">;

        while (myCursor < maxLessonId) {
          const lessons = await tx.courseLesson.findMany({
            skip: myCursor === -1 ? 0 : 1,
            take: 1,
            cursor:
              myCursor === -1
                ? undefined
                : {
                    id: myCursor,
                  },
            select: {
              id: true,
            },
          });

          lesson = lessons[0];
          myCursor = lesson.id;

          await tx.courseLessonVideo.deleteMany({
            where: {
              lessonId: lesson.id,
            },
          });
        }

        await Promise.all([
          tx.courseLesson.deleteMany({
            where: {
              courseId,
            },
          }),
          tx.courseEnrollment.deleteMany({
            where: {
              courseId,
            },
          }),
          tx.courseLike.deleteMany({
            where: {
              courseId,
            },
          }),
        ]);

        const deletedCourse = await tx.course.delete({
          where: {
            id: courseId,
          },
        });

        return deletedCourse;
      });

      return deletedCourse;
    } catch (error) {
      throw error;
    }
  }

  public async update(
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
  public async getManyCourseEnrollers(
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
            name: true,
            NIM: true,
            avatar: true,
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

  public async getById(
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
                  name: true,
                  NIM: true,
                },
              }
            : undefined,
          lessons: include_lessons
            ? {
                include: {
                  videos: true,
                },
              }
            : false,
        },
      });

      return course;
    } catch (error) {
      throw error;
    }
  }

  public async getManyEnrolledCourses(
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

  public async getManyOwnedCourses(userId: number): Promise<Course[]> {
    try {
      const courses = await this.courseTable.findMany({
        where: {
          authorId: userId,
        },
      });

      return courses;
    } catch (error) {
      throw error;
    }
  }

  public async create(
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
