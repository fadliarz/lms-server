import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ICourseCategoryService } from "../service/category.service";
import {
  CourseCategoryDITypes,
  CourseCategoryResourceId,
} from "../category.type";
import { StatusCode } from "../../../common/constants/statusCode";
import validateJoi from "../../../common/functions/validateJoi";
import {
  CreateCourseCategoryDtoJoi,
  UpdateBasicCourseCategoryDtoJoi,
} from "./category.joi";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import NaNException from "../../../common/class/exceptions/NaNException";
import getValuable from "../../../common/functions/removeNullFields";

export interface ICourseCategoryController {
  createCategory: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getCategoryById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getCategories: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateBasicCategory: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

@injectable()
export class CourseCategoryController implements ICourseCategoryController {
  @inject(CourseCategoryDITypes.SERVICE)
  private readonly service: ICourseCategoryService;

  public async createCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateCourseCategoryDtoJoi })(req, res, next);

      const resourceId = this.validateResourceId(req);
      const newCategory = await this.service.createCategory(
        resourceId,
        req.body,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({
        data: getValuable(newCategory),
      });
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
      const categoryId = this.validateCategoryId(req);
      const category = await this.service.getCategoryById(categoryId);

      return res
        .status(StatusCode.SUCCESS)
        .json({ data: getValuable(category) });
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

      return res
        .status(StatusCode.SUCCESS)
        .json({ data: categories.map((category) => getValuable(category)) });
    } catch (error) {
      next(error);
    }
  }

  public async updateBasicCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateBasicCourseCategoryDtoJoi })(
        req,
        res,
        next,
      );

      const categoryId = this.validateCategoryId(req);
      const resourceId = this.validateResourceId(req);
      const updatedCategory = await this.service.updateBasicCategory(
        categoryId,
        resourceId,
        req.body,
      );

      return res
        .status(StatusCode.SUCCESS)
        .json({ data: getValuable(updatedCategory) });
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(
    req: Request,
    error?: Error,
  ): CourseCategoryResourceId {
    const { id: userId, role } =
      getRequestUserOrThrowAuthenticationException(req);

    return {
      user: {
        id: userId,
        role,
      },
    };
  }

  private validateCategoryId(req: Request, error?: Error): number {
    const categoryId: number = Number(req.params.categoryId);
    if (isNaN(categoryId)) {
      throw error || new NaNException("categoryId");
    }

    return categoryId;
  }
}
