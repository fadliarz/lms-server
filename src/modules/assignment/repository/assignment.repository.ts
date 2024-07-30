import { inject, injectable } from "inversify";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import {
  CourseClassAssignmentDITypes,
  CourseClassAssignmentModel,
  CourseClassAssignmentResourceId,
  CreateCourseClassAssignmentDto,
} from "../assignment.type";
import {
  ICourseClassAssignmentAuthorization,
  ICourseClassAssignmentRepository,
} from "../assignment.interface";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import {
  PrismaDefaultTransactionConfigForRead,
  PrismaDefaultTransactionConfigForWrite,
} from "../../../common/constants/prismaDefaultConfig";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";

@injectable()
export default class CourseClassAssignmentRepository
  extends BaseAuthorization
  implements ICourseClassAssignmentRepository
{
  @inject(CourseClassAssignmentDITypes.AUTHORIZATION)
  private readonly authorization: ICourseClassAssignmentAuthorization;

  private readonly prisma = PrismaClientSingleton.getInstance();

  public async createAssignment(
    resourceId: CourseClassAssignmentResourceId,
    dto: CreateCourseClassAssignmentDto,
  ): Promise<CourseClassAssignmentModel> {
    return await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeCreateAssignment.bind(this.authorization),
      );

      const { classId } = resourceId;
      return tx.courseClassAssignment.create({
        data: {
          ...dto,
          classId,
        },
      });
    });
  }

  public async getAssignmentById(
    assignmentId: number,
    resourceId: CourseClassAssignmentResourceId,
  ): Promise<CourseClassAssignmentModel | null> {
    return await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeReadAssignment.bind(this.authorization),
      );

      return await tx.courseClassAssignment.findUnique({
        where: {
          id: assignmentId,
        },
      });
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async getAssignmentByIdOrThrow(
    assignmentId: number,
    resourceId: CourseClassAssignmentResourceId,
    error?: Error,
  ): Promise<CourseClassAssignmentModel> {
    const assignment = await this.getAssignmentById(assignmentId, resourceId);

    if (!assignment) {
      throw error || new RecordNotFoundException();
    }

    return assignment;
  }

  public async getAssignments(
    resourceId: CourseClassAssignmentResourceId,
  ): Promise<CourseClassAssignmentModel[]> {
    return await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeReadAssignment.bind(this.authorization),
      );

      const { classId } = resourceId;
      return await tx.courseClassAssignment.findMany({
        where: {
          classId,
        },
      });
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async updateAssignment(
    assignmentId: number,
    resourceId: CourseClassAssignmentResourceId,
    dto: Partial<CourseClassAssignmentModel>,
  ): Promise<CourseClassAssignmentModel> {
    return await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeUpdateAssignment.bind(this.authorization),
      );

      return await tx.courseClassAssignment.update({
        where: {
          id: assignmentId,
        },
        data: dto,
      });
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async deleteAssignment(
    assignmentId: number,
    resourceId: CourseClassAssignmentResourceId,
  ): Promise<{}> {
    await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeDeleteAssignment.bind(this.authorization),
      );

      await tx.courseClassAssignment.delete({
        where: {
          id: assignmentId,
        },
      });
    }, PrismaDefaultTransactionConfigForWrite);

    return {};
  }
}
