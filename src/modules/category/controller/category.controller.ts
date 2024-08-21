import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { CourseCategoryDITypes } from "../category.type";
import { StatusCode } from "../../../common/constants/statusCode";
import validateJoi from "../../../common/functions/validateJoi";
import {
  CreateCourseCategoryDtoJoi,
  UpdateCourseCategoryDtoJoi,
} from "./category.joi";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import NaNException from "../../../common/class/exceptions/NaNException";
import {
  ICourseCategoryController,
  ICourseCategoryService,
} from "../category.interface";

@injectable()
export default class CourseCategoryController
  implements ICourseCategoryController
{
  @inject(CourseCategoryDITypes.SERVICE)
  private readonly service: ICourseCategoryService;

  public async createCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateCourseCategoryDtoJoi })(req, res, next);

      const newCategory = await this.service.createCategory(
        getRequestUserOrThrowAuthenticationException(req),
        req.body,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({
        data: newCategory,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getCategories(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const categories = await this.service.getCategories();

      return res.status(StatusCode.SUCCESS).json({ data: categories });
    } catch (error) {
      next(error);
    }
  }

  public async getCategoryById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const category = await this.service.getCategoryById({
        categoryId: this.validateCategoryId(req),
      });

      return res.status(StatusCode.SUCCESS).json({ data: category });
    } catch (error) {
      next(error);
    }
  }

  public async updateCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateCourseCategoryDtoJoi })(req, res, next);

      const updatedCategory = await this.service.updateCategory(
        getRequestUserOrThrowAuthenticationException(req),
        { categoryId: this.validateCategoryId(req) },
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({ data: updatedCategory });
    } catch (error) {
      next(error);
    }
  }

  public async deleteCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await this.service.deleteCategory(
        getRequestUserOrThrowAuthenticationException(req),
        { categoryId: this.validateCategoryId(req) },
      );

      return res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }

  private validateCategoryId(req: Request, error?: Error): number {
    const categoryId: number = Number(req.params.categoryId);
    if (isNaN(categoryId)) {
      throw error || new NaNException("categoryId");
    }

    return categoryId;
  }
}
