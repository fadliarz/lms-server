import { injectable } from "inversify";
import BaseRepository from "../../../common/class/BaseRepository";
import { ICompetitionRepository } from "../competition.interface";
import { CompetitionModel } from "../competition.type";
import { $CompetitionAPI } from "../competition.api";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";

@injectable()
export default class CompetitionRepository
  extends BaseRepository
  implements ICompetitionRepository
{
  constructor() {
    super();
  }

  public async createCompetition(
    data: $CompetitionAPI.CreateCompetition.Dto,
  ): Promise<CompetitionModel> {
    return this.db.competition.create({ data });
  }

  public async getCompetitions(): Promise<CompetitionModel[]> {
    return this.db.competition.findMany();
  }

  public async getCompetitionById(id: {
    competitionId: number;
  }): Promise<CompetitionModel | null> {
    return this.db.competition.findUnique({
      where: { id: id.competitionId },
    });
  }

  public async getCompetitionByIdOrThrow(
    id: { competitionId: number },
    error?: Error,
  ): Promise<CompetitionModel> {
    const competition = await this.getCompetitionById(id);

    if (!competition) {
      throw error || new RecordNotFoundException();
    }

    return competition;
  }

  public async updateCompetition(
    id: { competitionId: number },
    data: Partial<CompetitionModel>,
  ): Promise<CompetitionModel> {
    return this.db.competition.update({
      where: { id: id.competitionId },
      data,
    });
  }

  public async deleteCompetition(id: {
    competitionId: number;
  }): Promise<Partial<{}>> {
    return this.db.competition.delete({
      where: { id: id.competitionId },
      select: {},
    });
  }
}
