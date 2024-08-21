import "reflect-metadata";
import { inject, injectable } from "inversify";
import { $CourseCategoryAPI, CourseCategoryDITypes } from "../category.type";
import {
  ICourseCategoryAuthorization,
  ICourseCategoryRepository,
  ICourseCategoryService,
} from "../category.interface";
import { UserModel } from "../../user/user.type";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";

@injectable()
export default class CourseCategoryService implements ICourseCategoryService {
  @inject(CourseCategoryDITypes.REPOSITORY)
  private readonly repository: ICourseCategoryRepository;

  @inject(CourseCategoryDITypes.AUTHORIZATION)
  private readonly authorization: ICourseCategoryAuthorization;

  public async createCategory(
    user: UserModel,
    dto: $CourseCategoryAPI.CreateCategory.Dto,
  ): Promise<$CourseCategoryAPI.CreateCategory.Response["data"]> {
    try {
      this.authorization.authorizeCreateCategory(user);

      return await this.repository.createCategory(dto);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getCategories(): Promise<
    $CourseCategoryAPI.GetCategories.Response["data"]
  > {
    try {
      return await this.repository.getCategories();
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getCategoryById(id: {
    categoryId: number;
  }): Promise<$CourseCategoryAPI.GetCategoryById.Response["data"]> {
    try {
      return this.repository.getCategoryByIdOrThrow(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async updateCategory(
    user: UserModel,
    id: { categoryId: number },
    dto: $CourseCategoryAPI.UpdateCategory.Dto,
  ): Promise<$CourseCategoryAPI.UpdateCategory.Response["data"]> {
    try {
      this.authorization.authorizeUpdateCategory(user);

      return await this.repository.updateCategory(id, dto);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async deleteCategory(
    user: UserModel,
    id: { categoryId: number },
  ): Promise<$CourseCategoryAPI.DeleteCategory.Response["data"]> {
    try {
      this.authorization.authorizeDeleteCategory(user);

      return await this.repository.deleteCategory(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }
}
