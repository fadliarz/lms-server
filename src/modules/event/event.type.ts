export const EventDITypes = {
  REPOSITORY: Symbol.for("EVENT_REPOSITORY"),
  SERVICE: Symbol.for("EVENT_SERVICE"),
  CONTROLLER: Symbol.for("EVENT_CONTROLLER"),
  AUTHORIZATION: Symbol.for("EVENT_AUTHORIZATION"),
} as const;

export type EventModel = {
  id: number;
  title: string;
  description: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
};
