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

export const CompetitionDITypes = {
  REPOSITORY: Symbol.for("COMPETITION_REPOSITORY"),
  SERVICE: Symbol.for("COMPETITION_SERVICE"),
  CONTROLLER: Symbol.for("COMPETITION_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COMPETITION_AUTHORIZATION"),
} as const;

export type CompetitionModel = {
  id: number;
  title: string;
  description: string | null;
  organizer: string;
  deadline: Date;
  reference: string;
  createdAt: Date;
  updatedAt: Date;
};
