import { UserModel } from "../user/user.type";
import { CompetitionModel } from "./competition.type";
import { NextFunction, Request, Response } from "express";
import { $CompetitionAPI } from "./competition.api";

export interface ICompetitionAuthorization {
  authorizeCreateCompetition: (user: UserModel) => Promise<void>;
  authorizeUpdateCompetition: (user: UserModel) => Promise<void>;
  authorizeDeleteCompetition: (user: UserModel) => Promise<void>;
}

export interface ICompetitionController {
  createCompetition: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getCompetitions: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getCompetitionById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateCompetition: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteCompetition: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export interface ICompetitionService {
  createCompetition: (
    user: UserModel,
    dto: $CompetitionAPI.CreateCompetition.Dto,
  ) => Promise<$CompetitionAPI.CreateCompetition.Response["data"]>;
  getCompetitions: () => Promise<
    $CompetitionAPI.GetCompetitions.Response["data"]
  >;
  getCompetitionById: (id: {
    competitionId: number;
  }) => Promise<$CompetitionAPI.GetCompetitionById.Response["data"]>;
  updateCompetition: (
    user: UserModel,
    id: {
      competitionId: number;
    },
    dto: $CompetitionAPI.UpdateCompetition.Dto,
  ) => Promise<$CompetitionAPI.UpdateCompetition.Response["data"]>;
  deleteCompetition: (
    user: UserModel,
    id: {
      competitionId: number;
    },
  ) => Promise<$CompetitionAPI.DeleteCompetition.Response["data"]>;
}

export interface ICompetitionRepository {
  createCompetition: (
    data: $CompetitionAPI.CreateCompetition.Dto,
  ) => Promise<CompetitionModel>;
  getCompetitions: () => Promise<CompetitionModel[]>;
  getCompetitionById: (id: {
    competitionId: number;
  }) => Promise<CompetitionModel | null>;
  getCompetitionByIdOrThrow: (
    id: { competitionId: number },
    error?: Error,
  ) => Promise<CompetitionModel>;
  updateCompetition: (
    id: { competitionId: number },
    data: Partial<CompetitionModel>,
  ) => Promise<CompetitionModel>;
  deleteCompetition: (id: { competitionId: number }) => Promise<{ id: number }>;
}
