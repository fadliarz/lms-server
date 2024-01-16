import "reflect-metadata";

import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { ICourseCategoryService } from "../service/category.service";
import { CourseCategoryDITypes } from "../category.type";
import { StatusCode } from "../../../common/constants/statusCode";
import validateJoi from "../../../common/functions/validateJoi";
import {
  CreateCourseCategoryDtoJoi,
  UpdateCourseCategoryDtoJoi,
} from "./category.joi";

export interface ICourseCategoryController {
  createCategory: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  getCategories: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
}

@injectable()
export class CourseCategoryController implements ICourseCategoryController {
  @inject(CourseCategoryDITypes.SERVICE)
  private readonly service: ICourseCategoryService;

  public async createCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateCourseCategoryDtoJoi })(req, res, next);

      const newCategory = await this.service.createCategory(req.body);

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
    next: NextFunction
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
    next: NextFunction
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateCourseCategoryDtoJoi })(req, res, next);

      const updatedCategory = await this.service.updateCategory(
        (req.params as any).categoryId,
        req.body
      );

      return res.status(StatusCode.SUCCESS).json({ data: updatedCategory });
    } catch (error) {
      next(error);
    }
  }
}
