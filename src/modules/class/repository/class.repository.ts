import { inject, injectable } from "inversify";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import {
  CourseClassDITypes,
  CourseClassModel,
  CourseClassResourceId,
  CreateCourseClassDto,
} from "../class.type";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import {
  PrismaDefaultTransactionConfigForRead,
  PrismaDefaultTransactionConfigForWrite,
} from "../../../common/constants/prismaDefaultConfig";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import {
  ICourseClassAuthorization,
  ICourseClassRepository,
} from "../class.interface";
import { UnauthenticatedResourceId } from "../../../common/types";

@injectable()
export default class CourseClassRepository
  extends BaseAuthorization
  implements ICourseClassRepository
{
  @inject(CourseClassDITypes.AUTHORIZATION)
  private readonly authorization: ICourseClassAuthorization;

  private readonly prisma = PrismaClientSingleton.getInstance();

  public async createClass(
    resourceId: CourseClassResourceId,
    dto: CreateCourseClassDto,
  ): Promise<CourseClassModel> {
    return await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeCreateClass.bind(this.authorization),
      );

      const { courseId } = resourceId;
      return await tx.courseClass.create({
        data: {
          ...dto,
          courseId,
        },
      });
    });
  }

  public async getClassById(
    classId: number,
    resourceId: UnauthenticatedResourceId<CourseClassResourceId>,
  ): Promise<CourseClassModel | null> {
    return await this.prisma.$transaction(async (tx) => {
      return await tx.courseClass.findUnique({
        where: {
          id: classId,
        },
      });
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async getClassByIdOrThrow(
    classId: number,
    resourceId: UnauthenticatedResourceId<CourseClassResourceId>,
    error?: Error,
  ): Promise<CourseClassModel> {
    const lesson = await this.getClassById(classId, resourceId);

    if (!lesson) {
      throw error || new RecordNotFoundException();
    }

    return lesson;
  }

  public async getClasses(
    resourceId: UnauthenticatedResourceId<CourseClassResourceId>,
  ): Promise<CourseClassModel[]> {
    return await this.prisma.$transaction(async (tx) => {
      const { courseId } = resourceId;
      return await tx.courseClass.findMany({
        where: {
          courseId,
        },
      });
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async updateClass(
    classId: number,
    resourceId: CourseClassResourceId,
    dto: Partial<CourseClassModel>,
  ): Promise<CourseClassModel> {
    return await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeUpdateClass.bind(this.authorization),
      );

      return await tx.courseClass.update({
        where: {
          id: classId,
        },
        data: dto,
      });
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async deleteClass(
    classId: number,
    resourceId: CourseClassResourceId,
  ): Promise<{}> {
    await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeDeleteClass.bind(this.authorization),
      );

      await tx.courseClass.delete({
        where: {
          id: classId,
        },
      });
    }, PrismaDefaultTransactionConfigForWrite);

    return {};
  }
}
