import "reflect-metadata";
import { injectable } from "inversify";
import { $CourseCategoryAPI, CourseCategoryModel } from "../category.type";
import { CourseCategory } from "@prisma/client";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import { ICourseCategoryRepository } from "../category.interface";
import BaseRepository from "../../../common/class/BaseRepository";

@injectable()
export default class CourseCategoryRepository
  extends BaseRepository
  implements ICourseCategoryRepository
{
  constructor() {
    super();
  }

  public async createCategory(
    data: $CourseCategoryAPI.CreateCategory.Dto,
  ): Promise<CourseCategory> {
    return this.db.courseCategory.create({ data });
  }

  public async getCategories(): Promise<CourseCategory[]> {
    return this.db.courseCategory.findMany();
  }

  public async getCategoryById(id: {
    categoryId: number;
  }): Promise<CourseCategoryModel | null> {
    return this.db.courseCategory.findUnique({
      where: {
        id: id.categoryId,
      },
    });
  }

  public async getCategoryByIdOrThrow(
    id: { categoryId: number },
    error?: Error,
  ): Promise<CourseCategoryModel> {
    const category = await this.getCategoryById(id);

    if (!category) {
      throw new RecordNotFoundException();
    }

    return category;
  }

  public async updateCategory(
    id: {
      categoryId: number;
    },
    data: $CourseCategoryAPI.UpdateCategory.Dto,
  ): Promise<CourseCategory> {
    return this.db.courseCategory.update({
      where: {
        id: id.categoryId,
      },
      data,
    });
  }

  public async deleteCategory(id: {
    categoryId: number;
  }): Promise<CourseCategory> {
    return this.db.courseCategory.delete({
      where: {
        id: id.categoryId,
      },
    });
  }
}
