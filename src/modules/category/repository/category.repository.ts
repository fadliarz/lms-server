import "reflect-metadata";
import { inject, injectable } from "inversify";
import {
  CourseCategoryDITypes,
  CourseCategoryModel,
  CourseCategoryResourceId,
  CreateCourseCategoryDto,
  ICourseCategoryAuthorization,
  UpdateBasicCourseCategoryDto,
} from "../category.type";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import { CourseCategory, User } from "@prisma/client";

import {
  IPrismaQueryRaw,
  PrismaQueryRawDITypes,
} from "../../../common/class/prisma_query_raw/prisma_query_raw.type";
import {
  PrismaDefaultTransactionConfigForRead,
  PrismaDefaultTransactionConfigForWrite,
} from "../../../common/constants/prismaDefaultConfig";
import { PrismaTransaction } from "../../../common/types";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import InternalServerException from "../../../common/class/exceptions/InternalServerException";
import CourseCategoryAuthorization from "../authorization/category.authorization";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";

export interface ICourseCategoryRepository {
  createCategory: (
    resourceId: CourseCategoryResourceId,
    dto: CreateCourseCategoryDto,
  ) => Promise<CourseCategory>;
  getCategories: () => Promise<CourseCategory[]>;
  getCategoryById: (categoryId: number) => Promise<CourseCategoryModel | null>;
  getCategoryByIdOrThrow: (
    categoryId: number,
    error?: Error,
  ) => Promise<CourseCategoryModel>;
  updateCategory: (
    categoryId: number,
    resourceId: CourseCategoryResourceId,
    dto: UpdateBasicCourseCategoryDto,
  ) => Promise<CourseCategory>;
}

@injectable()
export class CourseCategoryRepository implements ICourseCategoryRepository {
  @inject(CourseCategoryDITypes.AUTHORIZATION)
  private readonly authorization: ICourseCategoryAuthorization;

  @inject(PrismaQueryRawDITypes.PRISMA_QUERY_RAW)
  private readonly prismaQueryRaw: IPrismaQueryRaw;

  private readonly prisma = PrismaClientSingleton.getInstance();

  public async createCategory(
    resourceId: CourseCategoryResourceId,
    dto: CreateCourseCategoryDto,
  ): Promise<CourseCategory> {
    return await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeCreateCategory,
      );

      return await tx.courseCategory.create({ data: dto });
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async getCategoryById(
    categoryId: number,
  ): Promise<CourseCategoryModel | null> {
    return await this.prisma.$transaction(async (tx) => {
      return await tx.courseCategory.findUnique({
        where: { id: categoryId },
      });
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async getCategoryByIdOrThrow(
    categoryId: number,
    error?: Error,
  ): Promise<CourseCategoryModel> {
    const category = await this.getCategoryById(categoryId);

    if (!category) {
      throw new RecordNotFoundException();
    }

    return category;
  }

  public async getCategories(): Promise<CourseCategory[]> {
    return await this.prisma.$transaction(async (tx) => {
      return await tx.courseCategory.findMany();
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async updateCategory(
    categoryId: number,
    resourceId: CourseCategoryResourceId,
    dto: UpdateBasicCourseCategoryDto,
  ): Promise<CourseCategory> {
    return await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeUpdateCategory.bind(this.authorization),
      );

      await this.prismaQueryRaw.courseCategory.selectForUpdateByIdOrThrow(
        tx,
        categoryId,
      );

      return await tx.courseCategory.update({
        where: {
          id: categoryId,
        },
        data: dto,
      });
    }, PrismaDefaultTransactionConfigForWrite);
  }

  private async authorize(
    tx: PrismaTransaction,
    resourceId: CourseCategoryResourceId,
    fn: typeof CourseCategoryAuthorization.prototype.authorizeCreateCategory,
  ): Promise<{
    user: User;
  }> {
    const {
      user: { id: userId },
    } = resourceId;
    const user = await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
      tx,
      userId,
    );

    const { isStudent, isInstructor, isAdmin } = getRoleStatus(user.role);
    if (!(isStudent || isInstructor || isAdmin)) {
      throw new InternalServerException();
    }

    fn(user);

    return {
      user,
    };
  }
}
