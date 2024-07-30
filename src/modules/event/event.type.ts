import { UserRoleModel } from "../course/course.type";

export const EventDITypes = {
  REPOSITORY: Symbol.for("EVENT_REPOSITORY"),
  SERVICE: Symbol.for("EVENT_SERVICE"),
  CONTROLLER: Symbol.for("EVENT_CONTROLLER"),
  AUTHORIZATION: Symbol.for("EVENT_AUTHORIZATION"),
} as const;

export enum eventUrls {
  root = "/events",
  event = "/:eventId",
}

export enum EventErrorMessage {
  EVENT_DOES_NOT_EXIST = "event doesn't exist!",
}

/**
 *
 *
 * Model
 *
 *
 */

export type EventModel = {
  id: number;
  title: string;
  description: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
};

/**
 *
 *
 * Dto
 *
 *
 */

export type CreateEventDto = {
  title: string;
  description?: string;
  date: Date;
};

export type UpdateEventDto = Partial<CreateEventDto>;

/**
 *
 *
 * ResourceId
 *
 *
 */

export type EventResourceId = {
  user: {
    id: number;
    role: UserRoleModel;
  };
};
