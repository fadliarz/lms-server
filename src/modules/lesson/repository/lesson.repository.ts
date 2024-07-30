import "reflect-metadata";
import {
  CourseLessonDITypes,
  CourseLessonModel,
  CourseLessonResourceId,
  CreateCourseLessonDto,
} from "../lesson.type";
import { inject, injectable } from "inversify";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import {
  PrismaDefaultTransactionConfigForRead,
  PrismaDefaultTransactionConfigForWrite,
} from "../../../common/constants/prismaDefaultConfig";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import {
  ICourseLessonAuthorization,
  ICourseLessonRepository,
} from "../lesson.interface";
import { UnauthenticatedResourceId } from "../../../common/types";

@injectable()
export default class CourseLessonRepository
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
    resourceId: UnauthenticatedResourceId<CourseLessonResourceId>,
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
    resourceId: UnauthenticatedResourceId<CourseLessonResourceId>,
    error?: Error,
  ): Promise<CourseLessonModel> {
    const lesson = await this.getLessonById(lessonId, resourceId);

    if (!lesson) {
      throw error || new RecordNotFoundException();
    }

    return lesson;
  }

  public async getLessons(
    resourceId: UnauthenticatedResourceId<CourseLessonResourceId>,
  ): Promise<CourseLessonModel[]> {
    return await this.prisma.$transaction(async (tx) => {
      const { courseId } = resourceId;
      return await tx.courseLesson.findMany({
        where: {
          courseId,
        },
      });
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async updateLesson(
    lessonId: number,
    resourceId: CourseLessonResourceId,
    dto: Partial<CourseLessonModel>,
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
