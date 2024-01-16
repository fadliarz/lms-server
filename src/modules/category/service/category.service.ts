import "reflect-metadata";

import { inject, injectable } from "inversify";
import {
  CourseCategoryDITypes,
  CourseCategoryModel,
  CreateCourseCategoryDto,
  UpdateCourseCategoryDto,
} from "../category.type";
import { ICourseCategoryRepository } from "../repository/category.repository";
import getValuable from "../../../common/functions/getValuable";

export interface ICourseCategoryService {
  createCategory: (
    dto: CreateCourseCategoryDto
  ) => Promise<CourseCategoryModel>;
  getCategories: () => Promise<CourseCategoryModel[]>;
  updateCategory: (
    categoryId: number,
    dto: UpdateCourseCategoryDto
  ) => Promise<CourseCategoryModel>;
}

@injectable()
export class CourseCategoryService implements ICourseCategoryService {
  @inject(CourseCategoryDITypes.REPOSITORY)
  private readonly repository: ICourseCategoryRepository;

  public async createCategory(
    dto: CreateCourseCategoryDto
  ): Promise<CourseCategoryModel> {
    const newCategory = await this.repository.createCategory(dto);

    return getValuable(newCategory);
  }

  public async getCategories(): Promise<CourseCategoryModel[]> {
    const categories = await this.repository.getCategories();
    const valuableCategories = categories.map((category) => {
      return getValuable(category);
    });

    return valuableCategories;
  }

  public async updateCategory(
    categoryId: number,
    dto: UpdateCourseCategoryDto
  ): Promise<CourseCategoryModel> {
    const updatedCategory = await this.repository.updateCategory(
      categoryId,
      dto
    );

    return getValuable(updatedCategory);
  }
}
