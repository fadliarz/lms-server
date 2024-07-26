import { UserModel } from "../user/user.type";
import { UserRoleModel } from "../course/course.type";
import { Event } from "@prisma/client";
import {
  IControllerTemplate,
  IRepositoryTemplate,
  IServiceTemplate,
} from "../../common/types";

export const EventDITypes = {
  REPOSITORY: Symbol.for("EVENT_REPOSITORY"),
  SERVICE: Symbol.for("EVENT_SERVICE"),
  CONTROLLER: Symbol.for("EVENT_CONTROLLER"),
  AUTHORIZATION: Symbol.for("EVENT_AUTHORIZATION"),
};

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
 * Interface
 *
 *
 */

export interface IEventAuthorization {
  authorizeCreateEvent: (user: UserModel) => void;
  authorizeReadEvent: (user: UserModel) => void;
  authorizeReadEvents: (user: UserModel) => void;
  authorizeUpdateEvent: (user: UserModel) => void;
  authorizeDeleteEvent: (user: UserModel) => void;
}

export type IEventController = IControllerTemplate;

export type IEventService = IServiceTemplate<
  EventModel,
  EventResourceId,
  CreateEventDto,
  UpdateEventDto
>;

export type IEventRepository = IRepositoryTemplate<
  EventModel,
  CreateEventDto,
  EventResourceId
>;

/**
 *
 *
 * Model
 *
 *
 */

export type EventModel = Event;

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
