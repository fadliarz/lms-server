import "reflect-metadata";
import { inject, injectable } from "inversify";
import {
  CourseCategoryDITypes,
  CourseCategoryModel,
  CourseCategoryResourceId,
  CreateCourseCategoryDto,
  UpdateBasicCourseCategoryDto,
} from "../category.type";
import { ICourseCategoryRepository } from "../repository/category.repository";
import getValuable from "../../../common/functions/getValuable";

export interface ICourseCategoryService {
  createCategory: (
    resourceId: CourseCategoryResourceId,
    dto: CreateCourseCategoryDto,
  ) => Promise<CourseCategoryModel>;
  getCategoryById: (categoryId: number) => Promise<CourseCategoryModel>;
  getCategories: () => Promise<CourseCategoryModel[]>;
  updateBasicCategory: (
    categoryId: number,
    resourceId: CourseCategoryResourceId,
    dto: UpdateBasicCourseCategoryDto,
  ) => Promise<CourseCategoryModel>;
}

@injectable()
export class CourseCategoryService implements ICourseCategoryService {
  @inject(CourseCategoryDITypes.REPOSITORY)
  private readonly repository: ICourseCategoryRepository;

  public async createCategory(
    resourceId: CourseCategoryResourceId,
    dto: CreateCourseCategoryDto,
  ): Promise<CourseCategoryModel> {
    return await this.repository.createCategory(resourceId, dto);
  }

  public async getCategoryById(
    categoryId: number,
  ): Promise<CourseCategoryModel> {
    return await this.repository.getCategoryByIdOrThrow(categoryId);
  }

  public async getCategories(): Promise<CourseCategoryModel[]> {
    return await this.repository.getCategories();
  }

  public async updateBasicCategory(
    categoryId: number,
    resourceId: CourseCategoryResourceId,
    dto: UpdateBasicCourseCategoryDto,
  ): Promise<CourseCategoryModel> {
    return await this.repository.updateCategory(categoryId, resourceId, dto);
  }
}
