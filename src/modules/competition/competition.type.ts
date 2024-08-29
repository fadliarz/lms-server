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
