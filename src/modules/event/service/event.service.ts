import { inject, injectable } from "inversify";
import { $EventAPI, EventDITypes } from "../event.type";
import {
  IEventAuthorization,
  IEventRepository,
  IEventService,
} from "../event.interface";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import { UserModel } from "../../user/user.type";

@injectable()
export default class EventService
  extends BaseAuthorization
  implements IEventService
{
  @inject(EventDITypes.REPOSITORY)
  private readonly repository: IEventRepository;

  @inject(EventDITypes.AUTHORIZATION)
  private readonly authorization: IEventAuthorization;

  public async createEvent(
    user: UserModel,
    dto: $EventAPI.CreateEvent.Dto,
  ): Promise<$EventAPI.CreateEvent.Response["data"]> {
    try {
      this.authorization.authorizeCreateEvent(user);

      return await this.repository.createEvent(dto);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getEvents(): Promise<$EventAPI.GetEvents.Response["data"]> {
    try {
      return await this.repository.getEvents();
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getEventById(id: {
    eventId: number;
  }): Promise<$EventAPI.GetEventById.Response["data"]> {
    try {
      return await this.repository.getEventByIdOrThrow(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async updateEvent(
    user: UserModel,
    id: {
      eventId: number;
    },
    dto: $EventAPI.UpdateEvent.Dto,
  ): Promise<$EventAPI.UpdateEvent.Response["data"]> {
    try {
      this.authorization.authorizeUpdateEvent(user);

      return await this.repository.updateEvent(id, dto);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async deleteEvent(
    user: UserModel,
    id: {
      eventId: number;
    },
  ): Promise<$EventAPI.DeleteEvent.Response["data"]> {
    try {
      this.authorization.authorizeDeleteEvent(user);

      return await this.repository.deleteEvent(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }
}
