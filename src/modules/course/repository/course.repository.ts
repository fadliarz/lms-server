import "reflect-metadata";
import {
  CourseDITypes,
  CourseEnrollmentRoleModel,
  CourseLikeModel,
  CourseLikeResourceId,
  CourseModel,
  CourseResourceId,
  CreateCourseDto,
  GetCourseByIdData,
  GetCourseByIdQuery,
  GetCoursesData,
  GetCoursesQuery,
  GetEnrolledCoursesData,
  GetEnrolledCoursesQuery,
  ICourseAuthorization,
  UpdateCourseDto,
} from "../course.type";
import { inject, injectable } from "inversify";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import {
  PrismaDefaultTransactionConfigForRead,
  PrismaDefaultTransactionConfigForWrite,
} from "../../../common/constants/prismaDefaultConfig";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import isEqualOrIncludeCourseEnrollmentRole from "../../../common/functions/isEqualOrIncludeCourseEnrollmentRole";
import {
  IPrismaQueryRaw,
  PrismaQueryRawDITypes,
} from "../../../common/class/prisma_query_raw/prisma_query_raw.type";

export interface ICourseRepository {
  createCourse: (
    resourceId: CourseResourceId,
    dto: CreateCourseDto,
  ) => Promise<CourseModel>;
  getCourseById: (
    courseId: number,
    resourceId: CourseResourceId,
    query: GetCourseByIdQuery,
  ) => Promise<GetCourseByIdData | null>;
  getCourseByIdOrThrow: (
    courseId: number,
    resourceId: CourseResourceId,
    query: GetCourseByIdQuery,
    error?: Error,
  ) => Promise<CourseModel>;
  getCourses: (query: GetCoursesQuery) => Promise<GetCoursesData>;
  getEnrolledCourses: (
    resourceId: CourseResourceId,
    query: GetEnrolledCoursesQuery,
  ) => Promise<GetEnrolledCoursesData>;
  updateCourse: (
    courseId: number,
    resourceId: CourseResourceId,
    dto: UpdateCourseDto,
  ) => Promise<CourseModel>;
  deleteCourse: (courseId: number, resourceId: CourseResourceId) => Promise<{}>;
  createLike: (resourceId: CourseLikeResourceId) => Promise<CourseLikeModel>;
  getLikeById: (
    likeId: number,
    resourceId: CourseLikeResourceId,
  ) => Promise<CourseLikeModel | null>;
  getLikeByIdOrThrow: (
    likeId: number,
    resourceId: CourseLikeResourceId,
    error?: Error,
  ) => Promise<CourseLikeModel>;
  deleteLike: (likeId: number, resourceId: CourseLikeResourceId) => Promise<{}>;
}

@injectable()
export class CourseRepository
  extends BaseAuthorization
  implements ICourseRepository
{
  @inject(CourseDITypes.AUTHORIZATION)
  private readonly authorization: ICourseAuthorization;

  private readonly prisma = PrismaClientSingleton.getInstance();

  @inject(PrismaQueryRawDITypes.PRISMA_QUERY_RAW)
  protected readonly prismaQueryRaw: IPrismaQueryRaw;

  public async createCourse(
    resourceId: CourseResourceId,
    dto: CreateCourseDto,
  ): Promise<CourseModel> {
    return await this.prisma.$transaction(async (tx) => {
      await this.authorizeUserRole(
        tx,
        resourceId,
        this.authorization.authorizeCreateCourse.bind(this.authorization),
      );

      const {
        user: { id: userId },
      } = resourceId;
      const newCourse = await tx.course.create({
        data: {
          ...dto,
          authorId: userId,
        },
      });

      return newCourse;
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async getCourseById(
    courseId: number,
    resourceId: CourseResourceId,
    query: GetCourseByIdQuery,
  ): Promise<GetCourseByIdData | null> {
    return await this.prisma.$transaction(async (tx) => {
      const {
        include_author,
        include_category,
        include_lessons,
        include_public_videos,
      } = query;
      return await tx.course.findUnique({
        where: { id: courseId },
        include: {
          author: include_author
            ? {
                select: {
                  id: true,
                  name: true,
                  NIM: true,
                  avatar: true,
                  about: true,
                  role: true,
                },
              }
            : false,
          category: include_category ? true : false,
          lessons: include_lessons
            ? {
                include: {
                  videos: include_public_videos
                    ? {
                        select: {
                          id: true,
                          name: true,
                          description: true,
                          totalDurations: true,
                          createdAt: true,
                          updatedAt: true,
                          lessonId: true,
                        },
                      }
                    : false,
                },
              }
            : false,
        },
      });
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async getCourseByIdOrThrow(
    courseId: number,
    resourceId: CourseResourceId,
    query: GetCourseByIdQuery,
    error?: Error,
  ): Promise<CourseModel> {
    const course = await this.getCourseById(courseId, resourceId, query);

    if (!course) {
      throw error || new RecordNotFoundException();
    }

    return course;
  }

  public async getCourses(query: GetCoursesQuery): Promise<GetCoursesData> {
    return await this.prisma.$transaction(async (tx) => {
      const { include_author, include_category, pageNumber, pageSize } = query;
      return await tx.course.findMany({
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        include: {
          author: include_author
            ? {
                select: {
                  id: true,
                  name: true,
                  NIM: true,
                  avatar: true,
                  about: true,
                  role: true,
                },
              }
            : false,
          category: include_category ? true : false,
        },
      });
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async getEnrolledCourses(
    resourceId: CourseResourceId,
    query: GetEnrolledCoursesQuery,
  ): Promise<GetEnrolledCoursesData> {
    return await this.prisma.$transaction(async (tx) => {
      const {
        user: { id: userId },
      } = resourceId;
      const {
        include_author,
        include_category,
        limit_student_courses,
        limit_instructor_courses,
        role,
      } = query;

      const roleSet = new Set(role);
      const enrolledCourses: GetEnrolledCoursesData = [];
      for (let role of roleSet) {
        const enrollments = await tx.courseEnrollment.findMany({
          where: {
            userId,
            role,
          },
          select: {
            course: {
              include: {
                author: include_author
                  ? {
                      select: {
                        id: true,
                        name: true,
                        NIM: true,
                        avatar: true,
                        about: true,
                        role: true,
                      },
                    }
                  : include_author,
                category: include_category ? true : false,
              },
            },
            role: true,
          },
          take: isEqualOrIncludeCourseEnrollmentRole(
            role,
            CourseEnrollmentRoleModel.STUDENT,
          )
            ? limit_student_courses
            : limit_instructor_courses,
        });

        const courses: GetEnrolledCoursesData = [];
        enrollments.forEach((enrollment) => {
          courses.push({ course: enrollment.course, role });
        });

        enrolledCourses.push(...courses);
      }

      return enrolledCourses;
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async updateCourse(
    courseId: number,
    resourceId: CourseResourceId,
    dto: UpdateCourseDto,
  ): Promise<CourseModel> {
    return await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        {
          ...resourceId,
          courseId,
        },
        this.authorization.authorizeUpdateBasicCourse.bind(this.authorization),
      );

      return await tx.course.update({
        where: { id: courseId },
        data: dto,
      });
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async deleteCourse(
    courseId: number,
    resourceId: CourseResourceId,
  ): Promise<{}> {
    await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        {
          user: resourceId.user,
          courseId,
        },
        this.authorization.authorizeDeleteCourse.bind(this.authorization),
      );

      await tx.course.delete({
        where: {
          id: courseId,
        },
      });
    }, PrismaDefaultTransactionConfigForWrite);

    return {};
  }

  public async createLike(
    resourceId: CourseLikeResourceId,
  ): Promise<CourseLikeModel> {
    return await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeCreateLike.bind(this.authorization),
      );

      const {
        user: { id: userId },
        courseId,
      } = resourceId;
      return await tx.courseLike.create({
        data: {
          courseId,
          userId,
        },
      });
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async getLikeById(
    likeId: number,
    resourceId: CourseLikeResourceId,
  ): Promise<CourseLikeModel | null> {
    return await this.prisma.$transaction(async (tx) => {
      return await tx.courseLike.findUnique({
        where: { id: likeId },
      });
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async getLikeByIdOrThrow(
    likeId: number,
    resourceId: CourseLikeResourceId,
    error?: Error,
  ): Promise<CourseLikeModel> {
    const like = await this.getLikeById(likeId, resourceId);

    if (!like) {
      throw error || new RecordNotFoundException();
    }

    return like;
  }

  public async deleteLike(
    likeId: number,
    resourceId: CourseLikeResourceId,
  ): Promise<{}> {
    await this.prisma.$transaction(async (tx) => {
      const {
        user: { role },
      } = await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeDeleteLike.bind(this.authorization),
      );

      try {
        await tx.courseLike.delete({
          where: {
            id: likeId,
          },
          select: {
            id: true,
          },
        });
      } catch (error: any) {
        console.log(error);

        throw error;
      }
    }, PrismaDefaultTransactionConfigForWrite);

    return {};
  }
}
