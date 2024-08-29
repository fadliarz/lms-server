import { inject, injectable } from "inversify";
import { CompetitionDITypes } from "../competition.type";
import {
  ICompetitionController,
  ICompetitionService,
} from "../competition.interface";
import { NextFunction, Request, Response } from "express";
import validateJoi from "../../../common/functions/validateJoi";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import { StatusCode } from "../../../common/constants/statusCode";
import NaNException from "../../../common/class/exceptions/NaNException";
import {
  CreateCompetitionDtoJoi,
  UpdateCompetitionDtoJoi,
} from "./competition.joi";
import { $CompetitionAPI } from "../competition.api";

@injectable()
export default class CompetitionController implements ICompetitionController {
  @inject(CompetitionDITypes.SERVICE)
  private readonly service: ICompetitionService;

  public async createCompetition(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      validateJoi({ body: CreateCompetitionDtoJoi });

      const newCompetition = await this.service.createCompetition(
        getRequestUserOrThrowAuthenticationException(req),
        req.body,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({
        data: newCompetition,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getCompetitions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const competitions = await this.service.getCompetitions();

      return res.status(StatusCode.SUCCESS).json({
        data: competitions,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getCompetitionById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const competition = await this.service.getCompetitionById({
        competitionId: this.validateCompetitionId(req),
      });

      return res.status(StatusCode.SUCCESS).json({
        data: competition,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateCompetition(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({
        body: UpdateCompetitionDtoJoi,
      })(req, res, next);

      const updatedCompetition = await this.service.updateCompetition(
        getRequestUserOrThrowAuthenticationException(req),
        { competitionId: this.validateCompetitionId(req) },
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: updatedCompetition,
      } satisfies $CompetitionAPI.UpdateCompetition.Response);
    } catch (error) {
      next(error);
    }
  }

  public async deleteCompetition(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await this.service.deleteCompetition(
        getRequestUserOrThrowAuthenticationException(req),
        { competitionId: this.validateCompetitionId(req) },
      );

      return res.status(StatusCode.SUCCESS).json({
        data: {},
      } satisfies $CompetitionAPI.DeleteCompetition.Response);
    } catch (error) {
      next(error);
    }
  }

  private validateCompetitionId(req: Request): number {
    const competitionId: number = Number(req.params.competitionId);
    if (isNaN(competitionId)) {
      throw new NaNException("competitionId");
    }

    return competitionId;
  }
}
