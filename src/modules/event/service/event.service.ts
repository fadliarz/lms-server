import { inject, injectable } from "inversify";
import {
  CreateEventDto,
  EventDITypes,
  EventModel,
  EventResourceId,
  IEventRepository,
  IEventService,
  UpdateEventDto,
} from "../event.type";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";

@injectable()
export default class EventService implements IEventService {
  @inject(EventDITypes.REPOSITORY)
  private readonly repository: IEventRepository;

  public async create(
    resourceId: EventResourceId,
    dto: CreateEventDto,
  ): Promise<EventModel> {
    try {
      return await this.repository.create(resourceId, dto);
    } catch (error: any) {
      throw handleRepositoryError(error, {});
    }
  }

  public async getById(
    id: number,
    resourceId: EventResourceId,
  ): Promise<EventModel> {
    return await this.repository.getByIdOrThrow(
      id,
      resourceId,
      new RecordNotFoundException(),
    );
  }

  public async getMany(resourceId: EventResourceId): Promise<EventModel[]> {
    return await this.repository.getMany(resourceId);
  }

  public async update(
    id: number,
    resourceId: EventResourceId,
    dto: UpdateEventDto,
  ): Promise<EventModel> {
    return await this.repository.update(id, resourceId, dto);
  }

  public async delete(id: number, resourceId: EventResourceId): Promise<{}> {
    await this.repository.delete(id, resourceId);

    return {};
  }
}
