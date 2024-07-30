import { inject, injectable } from "inversify";
import { EventDITypes } from "../event.type";
import { NextFunction, Request, Response } from "express-serve-static-core";
import validateJoi from "../../../common/functions/validateJoi";
import { StatusCode } from "../../../common/constants/statusCode";
import { CourseResourceId } from "../../course/course.type";
import { CreateEventDtoJoi, UpdateEventDtoJoi } from "./event.joi";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import NaNException from "../../../common/class/exceptions/NaNException";
import { IEventController, IEventService } from "../event.interface";

@injectable()
export default class EventController implements IEventController {
  @inject(EventDITypes.SERVICE)
  private readonly service: IEventService;

  public async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateEventDtoJoi })(req, res, next);

      const resourceId = this.validateResourceId(req);
      const newEvent = await this.service.create(resourceId, req.body);

      return res.status(StatusCode.RESOURCE_CREATED).json({ data: newEvent });
    } catch (error) {
      next(error);
    }
  }

  public async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const eventId = this.validateEventId(req);
      const resourceId = this.validateResourceId(req);
      const event = await this.service.getById(eventId, resourceId);

      res.status(StatusCode.SUCCESS).json({ data: event });
    } catch (error) {
      next(error);
    }
  }

  public async getMany(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const eventId = this.validateEventId(req);
      const resourceId = this.validateResourceId(req);
      const events = await this.service.getById(eventId, resourceId);

      return res.status(StatusCode.SUCCESS).json({ data: events });
    } catch (error) {
      next(error);
    }
  }

  public async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateEventDtoJoi })(req, res, next);

      const eventId = this.validateEventId(req);
      const resourceId = this.validateResourceId(req);
      const updatedEvent = await this.service.update(
        eventId,
        resourceId,
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({ data: updatedEvent });
    } catch (error) {
      next(error);
    }
  }

  public async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const eventId = this.validateEventId(req);
      const resourceId = this.validateResourceId(req);
      await this.service.delete(eventId, resourceId);

      return res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(req: Request, error?: Error): CourseResourceId {
    const { id: userId, role } =
      getRequestUserOrThrowAuthenticationException(req);

    return {
      user: {
        id: userId,
        role,
      },
    };
  }

  private validateEventId(req: Request): number {
    const eventId: number = Number(req.params.eventId);
    if (isNaN(eventId)) {
      throw new NaNException("eventId");
    }

    return eventId;
  }
}
