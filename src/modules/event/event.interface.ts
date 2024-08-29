import { UserModel } from "../user/user.type";
import { EventModel } from "./event.type";
import { NextFunction, Request, Response } from "express";
import { $EventAPI } from "./event.api";

export interface IEventAuthorization {
  authorizeCreateEvent: (user: UserModel) => Promise<void>;
  authorizeUpdateEvent: (user: UserModel) => Promise<void>;
  authorizeDeleteEvent: (user: UserModel) => Promise<void>;
}

export interface IEventController {
  createEvent: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getEvents: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getEventById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateEvent: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteEvent: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export interface IEventService {
  createEvent: (
    user: UserModel,
    dto: $EventAPI.CreateEvent.Dto,
  ) => Promise<$EventAPI.CreateEvent.Response["data"]>;
  getEvents: () => Promise<$EventAPI.GetEvents.Response["data"]>;
  getEventById: (id: {
    eventId: number;
  }) => Promise<$EventAPI.GetEventById.Response["data"]>;
  updateEvent: (
    user: UserModel,
    id: {
      eventId: number;
    },
    dto: $EventAPI.UpdateEvent.Dto,
  ) => Promise<$EventAPI.UpdateEvent.Response["data"]>;
  deleteEvent: (
    user: UserModel,
    id: {
      eventId: number;
    },
  ) => Promise<$EventAPI.DeleteEvent.Response["data"]>;
}

export interface IEventRepository {
  createEvent: (data: $EventAPI.CreateEvent.Dto) => Promise<EventModel>;
  getEvents: () => Promise<EventModel[]>;
  getEventById: (id: { eventId: number }) => Promise<EventModel | null>;
  getEventByIdOrThrow: (
    id: { eventId: number },
    error?: Error,
  ) => Promise<EventModel>;
  updateEvent: (
    id: { eventId: number },
    data: Partial<EventModel>,
  ) => Promise<EventModel>;
  deleteEvent: (id: { eventId: number }) => Promise<EventModel>;
}
