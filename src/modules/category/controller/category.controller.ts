import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
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
  UpdateCourseCategoryDtoJoi,
} from "./category.joi";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import NaNException from "../../../common/class/exceptions/NaNException";

export interface ICourseCategoryController {
  createCategory: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getCategories: (
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

  public async updateCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateCourseCategoryDtoJoi })(req, res, next);

      const categoryId = this.validateCategoryId(req);
      const resourceId = this.validateResourceId(req);
      const updatedCategory = await this.service.updateCategory(
        categoryId,
        resourceId,
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({ data: updatedCategory });
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(
    req: Request,
    error?: Error,
  ): CourseCategoryResourceId {
    const { id: userId } = getRequestUserOrThrowAuthenticationException(req);

    return {
      userId,
    };
  }

  private validateCategoryId(req: Request, error?: Error): number {
    const categoryId: number = Number(req.params.lessonId);
    if (isNaN(categoryId)) {
      throw error || new NaNException("categoryId");
    }

    return categoryId;
  }
}
