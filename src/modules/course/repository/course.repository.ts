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
  GetCoursesQuery,
  GetEnrolledCoursesData,
  GetEnrolledCoursesQuery,
  ICourseAuthorization,
  UpdateBasicCourseDto,
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
  getCourses: (
    resourceId: CourseResourceId,
    query: GetCoursesQuery,
  ) => Promise<GetCourseByIdData[]>;
  getEnrolledCourses: (
    resourceId: CourseResourceId,
    query: GetEnrolledCoursesQuery,
  ) => Promise<GetEnrolledCoursesData>;
  updateCourse: (
    courseId: number,
    resourceId: CourseResourceId,
    dto: UpdateCourseDto,
  ) => Promise<CourseModel>;
  updateBasicCourse: (
    courseId: number,
    resourceId: CourseResourceId,
    dto: UpdateBasicCourseDto,
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

      const { userId } = resourceId;

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
      const { include_author, include_category } = query;
      return await tx.course.findUnique({
        where: { id: courseId },
        include: {
          author: include_author
            ? {
                select: {
                  id: true,
                  avatar: true,
                  name: true,
                  NIM: true,
                },
              }
            : false,
          category: include_category ? true : false,
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

  public async getCourses(
    resourceId: CourseResourceId,
    query: GetCoursesQuery,
  ): Promise<GetCourseByIdData[]> {
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
                  avatar: true,
                  name: true,
                  NIM: true,
                },
              }
            : include_author,
          category: include_category,
        },
      });
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async getEnrolledCourses(
    resourceId: CourseResourceId,
    query: GetEnrolledCoursesQuery,
  ): Promise<GetEnrolledCoursesData> {
    return await this.prisma.$transaction(async (tx) => {
      const { userId } = resourceId;
      const {
        include_author,
        include_category,
        limit_student_courses,
        limit_instructor_courses,
        role,
      } = query;
      const roleSet = new Set(role);
      const enrollments = await tx.courseEnrollment.findMany({
        where: {
          userId,
          role:
            (roleSet.has(CourseEnrollmentRoleModel.STUDENT)
              ? CourseEnrollmentRoleModel.STUDENT
              : undefined) ||
            (roleSet.has(CourseEnrollmentRoleModel.INSTRUCTOR)
              ? CourseEnrollmentRoleModel.INSTRUCTOR
              : undefined),
        },
        select: {
          course: {
            include: {
              author: include_author
                ? {
                    select: {
                      id: true,
                      avatar: true,
                      name: true,
                      NIM: true,
                    },
                  }
                : include_author,
              category: include_category,
            },
          },
          role: true,
        },
      });

      const courses: GetEnrolledCoursesData = [];
      enrollments.forEach((enrollment) => {
        courses.push({ ...enrollment.course, role: enrollment.role });
      });

      return courses;
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

  public async updateBasicCourse(
    courseId: number,
    resourceId: CourseResourceId,
    dto: UpdateBasicCourseDto,
  ): Promise<CourseModel> {
    return await this.updateCourse(courseId, resourceId, dto);
  }

  public async deleteCourse(
    courseId: number,
    resourceId: CourseResourceId,
  ): Promise<{}> {
    await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        {
          userId: resourceId.userId,
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

      const { userId, courseId } = resourceId;
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
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeDeleteLike.bind(this.authorization),
      );

      await tx.courseLike.delete({
        where: {
          id: likeId,
        },
        select: {
          id: true,
        },
      });
    }, PrismaDefaultTransactionConfigForWrite);

    return {};
  }
}
