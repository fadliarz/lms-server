import { UserModel } from "../user/user.type";
import {
  CreateEventDto,
  EventModel,
  EventResourceId,
  UpdateEventDto,
} from "./event.type";
import {
  IControllerTemplate,
  IRepositoryTemplate,
  IServiceTemplate,
} from "../../common/types";

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
