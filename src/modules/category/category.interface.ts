import { UserModel } from "../user/user.type";
import { NextFunction, Request, Response } from "express";
import {
  CourseCategoryModel,
  CourseCategoryResourceId,
  CreateCourseCategoryDto,
  UpdateBasicCourseCategoryDto,
} from "./category.type";
import { CourseCategory } from "@prisma/client";

export interface ICourseCategoryAuthorization {
  authorizeCreateCategory: (user: UserModel) => void;
  authorizeUpdateCategory: (user: UserModel) => void;
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
  updateBasicCategory: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

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

export interface ICourseCategoryRepository {
  createCategory: (
    resourceId: CourseCategoryResourceId,
    dto: CreateCourseCategoryDto,
  ) => Promise<CourseCategory>;
  getCategories: () => Promise<CourseCategory[]>;
  getCategoryById: (categoryId: number) => Promise<CourseCategoryModel | null>;
  getCategoryByIdOrThrow: (
    categoryId: number,
    error?: Error,
  ) => Promise<CourseCategoryModel>;
  updateCategory: (
    categoryId: number,
    resourceId: CourseCategoryResourceId,
    dto: UpdateBasicCourseCategoryDto,
  ) => Promise<CourseCategory>;
}
