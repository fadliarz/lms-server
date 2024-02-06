import "reflect-metadata";
import {
  BasicCourseModel,
  BasicUser,
  CourseLikeModel,
  CourseLikeResourceId,
  CreateCourseDto,
  EnrolledCourseModel,
  GetCourseByIdQuery,
  GetCoursesQuery,
  GetEnrolledCourseByIdQuery,
  GetEnrolledCoursesQuery,
} from "../course.type";
import { Course, CourseLesson, CourseStatus, Role } from "@prisma/client";
import { inject, injectable } from "inversify";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import getCourseIncludeArg from "../../../common/functions/getCourseIncludeArg";
import getCourseFilter from "../../../common/functions/getCourseFilterRole";
import getCoursesIncludeQuery from "../../../common/functions/getCoursesIncludeQuery";
import { PrismaUpdateOn } from "../../../common/constants/prismaUpdateOn";
import {
  PrismaDefaultTransactionConfigForRead,
  PrismaDefaultTransactionConfigForWrite,
} from "../../../common/constants/prismaDefaultConfig";
import {
  IPrismaQueryRaw,
  PrismaQueryRawDITypes,
} from "../../../common/class/prisma_query_raw/prisma_query_raw.type";

export interface ICourseRepository {
  createCourse: (userId: number, dto: CreateCourseDto) => Promise<Course>;
  getCourseById: (
    courseId: number,
    query: GetCourseByIdQuery,
  ) => Promise<Course>;
  getCourses: (query: GetCoursesQuery) => Promise<Course[]>;
  getEnrolledCourseById: (
    userId: number,
    courseId: number,
    query: GetEnrolledCourseByIdQuery,
  ) => Promise<Course>;
  getEnrolledCourses: (
    userId: number,
    query: GetEnrolledCoursesQuery,
  ) => Promise<EnrolledCourseModel[]>;
  getAuthor: (courseId: number) => Promise<BasicUser>;
  updateCourse: (
    courseId: number,
    dto: Partial<BasicCourseModel>,
  ) => Promise<Course>;
  deleteCourse: (courseId: number) => Promise<{}>;
  createLike: (
    userId: number,
    resourceId: CourseLikeResourceId,
  ) => Promise<CourseLikeModel>;
  deleteLike: (resourceId: CourseLikeResourceId) => Promise<{}>;
}

@injectable()
export class CourseRepository implements ICourseRepository {
  @inject(PrismaQueryRawDITypes.PRISMA_QUERY_RAW)
  private readonly prismaQueryRaw: IPrismaQueryRaw;

  private readonly prisma = PrismaClientSingleton.getInstance();

  public async createCourse(
    userId: number,
    courseDetails: CreateCourseDto,
  ): Promise<Course> {
    return await this.prisma.$transaction(async (tx) => {
      const newCourse = await tx.course.create({
        data: {
          ...courseDetails,
          authorId: userId,
        },
      });

      return newCourse;
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async getCourseById(
    courseId: number,
    query: GetCourseByIdQuery,
  ): Promise<Course> {
    return await this.prisma.$transaction(async (tx) => {
      const includeArg = getCourseIncludeArg(query);

      const course = await tx.course.findFirstOrThrow({
        where: { id: courseId, status: CourseStatus.PUBLISHED },
        include: includeArg,
      });

      return course;
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async getCourses(query: GetCoursesQuery) {
    return await this.prisma.$transaction(async (tx) => {
      const { pageNumber, pageSize } = query;
      const includeArg = getCoursesIncludeQuery(query);

      const courses = await tx.course.findMany({
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        include: includeArg,
      });

      return courses;
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async getEnrolledCourseById(
    userId: number,
    courseId: number,
    query: GetEnrolledCourseByIdQuery,
  ): Promise<Course> {
    return await this.prisma.$transaction(async (tx) => {
      const { role } = query;
      const { course: enrolledCourse } =
        await tx.courseEnrollment.findFirstOrThrow({
          where: {
            userId,
            courseId,
            role,
          },
          select: {
            course: true,
          },
        });

      return enrolledCourse;
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async getEnrolledCourses(
    userId: number,
    query: GetEnrolledCoursesQuery,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      let enrolledCourses: EnrolledCourseModel[] = [];
      const courseIncludeArg = getCourseIncludeArg(query);
      const { include_student_courses, include_instructor_courses } = query;

      if (include_student_courses) {
        const studentCourses = await tx.courseEnrollment.findMany({
          where: {
            userId,
            role: {
              in: getCourseFilter(query),
            },
          },
          select: { course: { include: courseIncludeArg } },
        });

        enrolledCourses = enrolledCourses.concat(
          studentCourses.map((studentCourse) => {
            return { course: studentCourse.course, role: Role.STUDENT };
          }) as EnrolledCourseModel[],
        );
      }

      if (include_instructor_courses) {
        const instructorCourses = await tx.courseEnrollment.findMany({
          where: {
            userId,
            role: {
              in: getCourseFilter(query),
            },
          },
          select: { course: { include: courseIncludeArg } },
        });

        enrolledCourses = enrolledCourses.concat(
          instructorCourses.map((instructorCourse) => {
            return { course: instructorCourse.course, role: Role.INSTRUCTOR };
          }) as EnrolledCourseModel[],
        );
      }

      return enrolledCourses;
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async getAuthor(courseId: number) {
    return await this.prisma.$transaction(async (tx) => {
      const { author } = await tx.course.findUniqueOrThrow({
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
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async updateCourse(
    courseId: number,
    dto: Partial<BasicCourseModel>,
  ): Promise<Course> {
    return await this.prisma.$transaction(async (tx) => {
      await this.prismaQueryRaw.course.selectForUpdateByIdOrThrow(tx, courseId);

      const updatedCourse = await tx.course.update({
        where: { id: courseId },
        data: dto,
      });

      return updatedCourse;
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async deleteCourse(courseId: number): Promise<{}> {
    await this.prisma.$transaction(async (tx) => {
      await this.prismaQueryRaw.course.selectForUpdateByIdOrThrow(tx, courseId);

      let myCursor = -1;
      const findLesson = await tx.courseLesson.findFirst({
        where: {
          courseId,
        },
        orderBy: {
          id: "desc",
        },
        select: { id: true },
      });

      if (findLesson) {
        const { id: maxLessonId } = findLesson;
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
      }

      await Promise.all([
        tx.courseEnrollment.deleteMany({
          where: {
            courseId,
          },
        }),
        tx.courseLesson.deleteMany({
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

      await tx.course.delete({
        where: {
          id: courseId,
        },
      });
    }, PrismaDefaultTransactionConfigForWrite);

    return {};
  }

  public async createLike(
    userId: number,
    resourceId: CourseLikeResourceId,
  ): Promise<CourseLikeModel> {
    return await this.prisma.$transaction(async (tx) => {
      const { courseId } = resourceId;
      await this.prismaQueryRaw.course.selectForUpdateByIdOrThrow(tx, courseId);

      const [newLike] = await Promise.all([
        tx.courseLike.create({
          data: {
            courseId: courseId,
            userId,
          },
        }),
        tx.course.update({
          where: {
            id: courseId,
          },
          data: PrismaUpdateOn.course.event.createLike,
        }),
      ]);

      return newLike;
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async deleteLike(resourceId: CourseLikeResourceId): Promise<{}> {
    await this.prisma.$transaction(async (tx) => {
      const { courseId, likeId } = resourceId;
      await this.prismaQueryRaw.course.selectForUpdateByIdOrThrow(tx, courseId);

      await Promise.all([
        tx.courseLike.delete({
          where: {
            id: likeId,
          },
          select: {
            id: true,
          },
        }),
        tx.course.update({
          where: {
            id: courseId,
          },
          data: PrismaUpdateOn.course.event.deleteLike,
          select: {
            id: true,
          },
        }),
      ]);
    }, PrismaDefaultTransactionConfigForWrite);

    return {};
  }
}
