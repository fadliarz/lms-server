import { ScholarshipModel } from "./scholarship.type";
import { UserModel } from "../user/user.type";
import { NextFunction, Request, Response } from "express";
import { $ScholarshipAPI } from "./scholarship.api";

export interface IScholarshipAuthorization {
  authorizeCreateScholarship: (user: UserModel) => Promise<void>;
  authorizeUpdateScholarship: (user: UserModel) => Promise<void>;
  authorizeDeleteScholarship: (user: UserModel) => Promise<void>;
}

export interface IScholarshipController {
  createScholarship: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getScholarships: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getScholarshipById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateScholarship: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteScholarship: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export interface IScholarshipService {
  createScholarship: (
    user: UserModel,
    dto: $ScholarshipAPI.CreateScholarship.Dto,
  ) => Promise<ScholarshipModel>;
  getScholarships: () => Promise<ScholarshipModel[]>;
  getScholarshipById: (scholarshipId: number) => Promise<ScholarshipModel>;
  updateScholarship: (
    scholarshipId: number,
    user: UserModel,
    dto: $ScholarshipAPI.UpdateScholarship.Dto,
  ) => Promise<ScholarshipModel>;
  deleteScholarship: (
    scholarshipId: number,
    user: UserModel,
  ) => Promise<{ id: number }>;
}

export interface IScholarshipRepository {
  createScholarship: (
    data: $ScholarshipAPI.CreateScholarship.Dto,
  ) => Promise<ScholarshipModel>;
  getScholarships: () => Promise<ScholarshipModel[]>;
  getScholarshipById: (
    scholarshipId: number,
  ) => Promise<ScholarshipModel | null>;
  getScholarshipByIdOrThrow: (
    scholarshipId: number,
    error?: Error,
  ) => Promise<ScholarshipModel>;
  updateScholarship: (
    scholarshipId: number,
    data: Partial<ScholarshipModel>,
  ) => Promise<ScholarshipModel>;
  deleteScholarship: (scholarshipId: number) => Promise<{ id: number }>;
}
