import { UserModel } from "../user/user.type";
import { NextFunction, Request, Response } from "express";
import { $CourseCategoryAPI, CourseCategoryModel } from "./category.type";
import { CourseCategory } from "@prisma/client";

export interface ICourseCategoryAuthorization {
  authorizeCreateCategory: (user: UserModel) => void;
  authorizeUpdateCategory: (user: UserModel) => void;
  authorizeDeleteCategory: (user: UserModel) => void;
}

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
  updateCategory: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteCategory: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export interface ICourseCategoryService {
  createCategory: (
    user: UserModel,
    dto: $CourseCategoryAPI.CreateCategory.Dto,
  ) => Promise<$CourseCategoryAPI.CreateCategory.Response["data"]>;
  getCategories: () => Promise<
    $CourseCategoryAPI.GetCategories.Response["data"]
  >;
  getCategoryById: (id: {
    categoryId: number;
  }) => Promise<$CourseCategoryAPI.GetCategoryById.Response["data"]>;
  updateCategory: (
    user: UserModel,
    id: { categoryId: number },
    dto: $CourseCategoryAPI.UpdateCategory.Dto,
  ) => Promise<$CourseCategoryAPI.UpdateCategory.Response["data"]>;
  deleteCategory: (
    user: UserModel,
    id: { categoryId: number },
  ) => Promise<$CourseCategoryAPI.DeleteCategory.Response["data"]>;
}

export interface ICourseCategoryRepository {
  createCategory: (
    data: $CourseCategoryAPI.CreateCategory.Dto,
  ) => Promise<CourseCategory>;
  getCategories: () => Promise<CourseCategory[]>;
  getCategoryById: (id: {
    categoryId: number;
  }) => Promise<CourseCategoryModel | null>;
  getCategoryByIdOrThrow: (
    id: { categoryId: number },
    error?: Error,
  ) => Promise<CourseCategoryModel>;
  updateCategory: (
    id: {
      categoryId: number;
    },
    data: $CourseCategoryAPI.UpdateCategory.Dto,
  ) => Promise<CourseCategory>;
  deleteCategory: (id: { categoryId: number }) => Promise<{}>;
}
