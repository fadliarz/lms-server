export const ScholarshipDITypes = {
  REPOSITORY: Symbol.for("SCHOLARSHIP_REPOSITORY"),
  SERVICE: Symbol.for("SCHOLARSHIP_SERVICE"),
  CONTROLLER: Symbol.for("SCHOLARSHIP_CONTROLLER"),
  AUTHORIZATION: Symbol.for("SCHOLARSHIP_AUTHORIZATION"),
} as const;

export type ScholarshipModel = {
  id: number;
  title: string;
  description: string | null;
  provider: string;
  deadline: Date;
  reference: string;
  createdAt: Date;
  updatedAt: Date;
};
