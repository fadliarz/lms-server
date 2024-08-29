import { CompetitionModel } from "./competition.type";

export namespace $CompetitionAPI {
  const root = "/competitions";
  const competition = root + "/:competitionId";

  export namespace CreateCompetition {
    export const endpoint = root;
    export const generateUrl = () => endpoint;
    export type Dto = {
      title: string;
      description?: string;
      organizer: string;
      deadline: Date;
      reference: string;
    };
    export type Response = {
      data: CompetitionModel;
    };
  }

  export namespace GetCompetitions {
    export const endpoint = root;
    export const generateUrl = () => endpoint;
    export type Response = {
      data: CompetitionModel[];
    };
  }

  export namespace GetCompetitionById {
    export const endpoint = competition;
    export const generateUrl = (competitionId: number) =>
      `/competitions/${competitionId}`;
    export type Response = {
      data: CompetitionModel;
    };
  }

  export namespace UpdateCompetition {
    export const endpoint = competition;
    export const generateUrl = (competitionId: number) =>
      `/competitions/${competitionId}`;
    export type Dto = {
      title?: string;
      description?: string;
      organizer?: string;
      deadline?: Date;
      reference?: string;
    };
    export type Response = {
      data: CompetitionModel;
    };
  }

  export namespace DeleteCompetition {
    export const endpoint = competition;
    export const generateUrl = (competitionId: number) =>
      `/competitions/${competitionId}`;
    export type Response = {
      data: {};
    };
  }
}
