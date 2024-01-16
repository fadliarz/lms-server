import "reflect-metadata";

import { injectable } from "inversify";
import {
  CreateCourseCategoryDto,
  UpdateCourseCategoryDto,
} from "../category.type";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import { CourseCategory } from "@prisma/client";

export interface ICourseCategoryRepository {
  createCategory: (dto: CreateCourseCategoryDto) => Promise<CourseCategory>;
  getCategories: () => Promise<CourseCategory[]>;
  updateCategory: (
    categoryId: number,
    dto: UpdateCourseCategoryDto
  ) => Promise<CourseCategory>;
}

@injectable()
export class CourseCategoryRepository implements ICourseCategoryRepository {
  private readonly prisma = PrismaClientSingleton.getInstance();
  private readonly courseCategoryTable = this.prisma.courseCategory;

  public async createCategory(
    dto: CreateCourseCategoryDto
  ): Promise<CourseCategory> {
    const newCategory = await this.courseCategoryTable.create({
      data: dto,
    });

    return newCategory;
  }

  public async getCategories(): Promise<CourseCategory[]> {
    const categories = await this.courseCategoryTable.findMany();

    return categories;
  }

  public async updateCategory(
    categoryId: number,
    dto: UpdateCourseCategoryDto
  ): Promise<CourseCategory> {
    const updatedCategory = await this.courseCategoryTable.update({
      where: {
        id: categoryId,
      },
      data: dto,
    });

    return updatedCategory;
  }
}
