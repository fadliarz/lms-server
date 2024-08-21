import { inject, injectable } from "inversify";
import {
  ICompetitionAuthorization,
  ICompetitionRepository,
  ICompetitionService,
} from "../competition.interface";
import { $CompetitionAPI, CompetitionDITypes } from "../competition.type";
import { UserModel } from "../../user/user.type";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";

@injectable()
export default class CompetitionService implements ICompetitionService {
  @inject(CompetitionDITypes.REPOSITORY)
  private readonly repository: ICompetitionRepository;

  @inject(CompetitionDITypes.AUTHORIZATION)
  private readonly authorization: ICompetitionAuthorization;

  public async createCompetition(
    user: UserModel,
    dto: $CompetitionAPI.CreateCompetition.Dto,
  ): Promise<$CompetitionAPI.CreateCompetition.Response["data"]> {
    try {
      await this.authorization.authorizeCreateCompetition(user);

      return this.repository.createCompetition(dto);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getCompetitions(): Promise<
    $CompetitionAPI.GetCompetitions.Response["data"]
  > {
    try {
      return this.repository.getCompetitions();
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getCompetitionById(id: {
    competitionId: number;
  }): Promise<$CompetitionAPI.GetCompetitionById.Response["data"]> {
    try {
      return this.repository.getCompetitionByIdOrThrow(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async updateCompetition(
    user: UserModel,
    id: { competitionId: number },
    dto: $CompetitionAPI.UpdateCompetition.Dto,
  ): Promise<$CompetitionAPI.UpdateCompetition.Response["data"]> {
    try {
      await this.authorization.authorizeUpdateCompetition(user);

      return this.repository.updateCompetition(id, dto);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async deleteCompetition(
    user: UserModel,
    id: { competitionId: number },
  ): Promise<$CompetitionAPI.DeleteCompetition.Response["data"]> {
    try {
      await this.authorization.authorizeDeleteCompetition(user);

      return this.repository.deleteCompetition(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }
}
