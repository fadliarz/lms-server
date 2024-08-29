import { injectable } from "inversify";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import { IEventRepository } from "../event.interface";
import BaseRepository from "../../../common/class/BaseRepository";
import { EventModel } from "../event.type";
import { $EventAPI } from "../event.api";

@injectable()
export default class EventRepository
  extends BaseRepository
  implements IEventRepository
{
  constructor() {
    super();
  }

  public async createEvent(
    data: $EventAPI.CreateEvent.Dto,
  ): Promise<$EventAPI.CreateEvent.Response["data"]> {
    return this.db.event.create({
      data,
    });
  }

  public async getEvents(): Promise<EventModel[]> {
    return this.db.event.findMany();
  }

  public async getEventById(id: {
    eventId: number;
  }): Promise<EventModel | null> {
    return this.db.event.findUnique({
      where: {
        id: id.eventId,
      },
    });
  }

  public async getEventByIdOrThrow(
    id: { eventId: number },
    error?: Error,
  ): Promise<EventModel> {
    const event = await this.getEventById(id);

    if (!event) {
      throw error || new RecordNotFoundException();
    }

    return event;
  }

  public async updateEvent(
    id: { eventId: number },
    data: Partial<EventModel>,
  ): Promise<EventModel> {
    return this.db.event.update({
      where: {
        id: id.eventId,
      },
      data,
    });
  }

  public async deleteEvent(id: { eventId: number }): Promise<EventModel> {
    return this.db.event.delete({
      where: {
        id: id.eventId,
      },
    });
  }
}
