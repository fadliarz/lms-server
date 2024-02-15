import "reflect-metadata";
import { CourseLessonModel } from "../lesson.type";
import { inject, injectable } from "inversify";
import {
  CourseLessonDITypes,
  CourseLessonResourceId,
  CreateCourseLessonDto,
  ICourseLessonAuthorization,
  UpdateCourseLessonDto,
} from "../lesson.type";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import {
  PrismaDefaultTransactionConfigForRead,
  PrismaDefaultTransactionConfigForWrite,
} from "../../../common/constants/prismaDefaultConfig";
import BaseAuthorization from "../../../common/class/BaseAuthorization";

export interface ICourseLessonRepository {
  createLesson: (
    resourceId: CourseLessonResourceId,
    dto: CreateCourseLessonDto,
  ) => Promise<CourseLessonModel>;
  getLessonById: (
    lessonId: number,
    resourceId: CourseLessonResourceId,
  ) => Promise<CourseLessonModel | null>;
  getLessonByIdOrThrow: (
    lessonId: number,
    resourceId: CourseLessonResourceId,
    error?: Error,
  ) => Promise<CourseLessonModel>;
  updateLesson: (
    lessonId: number,
    resourceId: CourseLessonResourceId,
    dto: UpdateCourseLessonDto,
  ) => Promise<CourseLessonModel>;
  deleteLesson: (
    lessonId: number,
    resourceId: CourseLessonResourceId,
  ) => Promise<{}>;
}

@injectable()
export class CourseLessonRepository
  extends BaseAuthorization
  implements ICourseLessonRepository
{
  @inject(CourseLessonDITypes.AUTHORIZATION)
  private readonly authorization: ICourseLessonAuthorization;

  private readonly prisma = PrismaClientSingleton.getInstance();

  public async createLesson(
    resourceId: CourseLessonResourceId,
    dto: CreateCourseLessonDto,
  ): Promise<CourseLessonModel> {
    return await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeCreateLesson.bind(this.authorization),
      );

      const { courseId } = resourceId;

      return await tx.courseLesson.create({
        data: {
          ...dto,
          courseId,
        },
      });
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async getLessonById(
    lessonId: number,
    resourceId: CourseLessonResourceId,
  ): Promise<CourseLessonModel | null> {
    return await this.prisma.$transaction(async (tx) => {
      return await tx.courseLesson.findUnique({
        where: {
          id: lessonId,
        },
      });
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async getLessonByIdOrThrow(
    lessonId: number,
    resourceId: CourseLessonResourceId,
    error?: Error,
  ): Promise<CourseLessonModel> {
    const lesson = await this.getLessonById(lessonId, resourceId);

    if (!lesson) {
      throw error || new RecordNotFoundException();
    }

    return lesson;
  }

  public async updateLesson(
    lessonId: number,
    resourceId: CourseLessonResourceId,
    dto: UpdateCourseLessonDto,
  ): Promise<CourseLessonModel> {
    return await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeUpdateLesson.bind(this.authorization),
      );

      return await tx.courseLesson.update({
        where: {
          id: lessonId,
        },
        data: dto,
      });
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async deleteLesson(
    lessonId: number,
    resourceId: CourseLessonResourceId,
  ): Promise<{}> {
    await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeDeleteLesson.bind(this.authorization),
      );

      await tx.courseLesson.delete({
        where: {
          id: lessonId,
        },
      });
    }, PrismaDefaultTransactionConfigForWrite);

    return {};
  }
}
