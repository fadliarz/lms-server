import { inject, injectable } from "inversify";
import { EventDITypes } from "../event.type";
import { NextFunction, Request, Response } from "express-serve-static-core";
import validateJoi from "../../../common/functions/validateJoi";
import { StatusCode } from "../../../common/constants/statusCode";
import { CreateEventDtoJoi, UpdateEventDtoJoi } from "./event.joi";
import NaNException from "../../../common/class/exceptions/NaNException";
import { IEventController, IEventService } from "../event.interface";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";

@injectable()
export default class EventController implements IEventController {
  @inject(EventDITypes.SERVICE)
  private readonly service: IEventService;

  public async createEvent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateEventDtoJoi })(req, res, next);

      const newEvent = await this.service.createEvent(
        getRequestUserOrThrowAuthenticationException(req),
        req.body,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({ data: newEvent });
    } catch (error) {
      next(error);
    }
  }

  public async getEventById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const event = await this.service.getEventById({
        eventId: this.validateEventId(req),
      });

      res.status(StatusCode.SUCCESS).json({ data: event });
    } catch (error) {
      next(error);
    }
  }

  public async getEvents(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const events = await this.service.getEvents();

      return res.status(StatusCode.SUCCESS).json({ data: events });
    } catch (error) {
      next(error);
    }
  }

  public async updateEvent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateEventDtoJoi })(req, res, next);

      const updatedEvent = await this.service.updateEvent(
        getRequestUserOrThrowAuthenticationException(req),
        { eventId: this.validateEventId(req) },
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({ data: updatedEvent });
    } catch (error) {
      next(error);
    }
  }

  public async deleteEvent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await this.service.deleteEvent(
        getRequestUserOrThrowAuthenticationException(req),
        { eventId: this.validateEventId(req) },
      );

      return res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }

  private validateEventId(req: Request): number {
    const eventId: number = Number(req.params.eventId);
    if (isNaN(eventId)) {
      throw new NaNException("eventId");
    }

    return eventId;
  }
}
