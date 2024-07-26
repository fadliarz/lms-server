import { inject, injectable } from "inversify";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import {
  CreateEventDto,
  EventModel,
  EventResourceId,
  IEventAuthorization,
  IEventRepository,
} from "../event.type";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import { CourseClassDITypes } from "../../class/class.type";
import {
  PrismaDefaultTransactionConfigForRead,
  PrismaDefaultTransactionConfigForWrite,
} from "../../../common/constants/prismaDefaultConfig";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";

@injectable()
export default class EventRepository
  extends BaseAuthorization
  implements IEventRepository
{
  @inject(CourseClassDITypes.AUTHORIZATION)
  private readonly authorization: IEventAuthorization;

  private readonly prisma = PrismaClientSingleton.getInstance();

  public async create(
    resourceId: EventResourceId,
    dto: CreateEventDto,
  ): Promise<EventModel> {
    return await this.prisma.$transaction(async (tx) => {
      await this.authorizeUserRole(
        tx,
        resourceId,
        this.authorization.authorizeCreateEvent.bind(this.authorization),
      );

      return await tx.event.create({
        data: {
          ...dto,
        },
      });
    });
  }

  public async getById(
    id: number,
    resourceId: EventResourceId,
  ): Promise<EventModel | null> {
    return await this.prisma.$transaction(async (tx) => {
      await this.authorizeUserRole(
        tx,
        resourceId,
        this.authorization.authorizeReadEvent.bind(this.authorization),
      );

      return await tx.event.findUnique({
        where: {
          id,
        },
      });
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async getByIdOrThrow(
    id: number,
    resourceId: EventResourceId,
    error?: Error,
  ): Promise<EventModel> {
    const event = await this.getById(id, resourceId);

    if (!event) {
      throw error || new RecordNotFoundException();
    }

    return event;
  }

  public async getMany(resourceId: EventResourceId): Promise<EventModel[]> {
    return await this.prisma.$transaction(async (tx) => {
      await this.authorizeUserRole(
        tx,
        resourceId,
        this.authorization.authorizeReadEvents.bind(this.authorization),
      );

      return await tx.event.findMany();
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async update(
    id: number,
    resourceId: EventResourceId,
    dto: Partial<EventModel>,
  ): Promise<EventModel> {
    return await this.prisma.$transaction(async (tx) => {
      await this.authorizeUserRole(
        tx,
        resourceId,
        this.authorization.authorizeUpdateEvent.bind(this.authorization),
      );

      return await tx.event.update({
        where: {
          id,
        },
        data: dto,
      });
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async delete(id: number, resourceId: EventResourceId): Promise<{}> {
    await this.prisma.$transaction(async (tx) => {
      await this.authorizeUserRole(
        tx,
        resourceId,
        this.authorization.authorizeDeleteEvent.bind(this.authorization),
      );

      await tx.event.delete({
        where: {
          id,
        },
      });
    }, PrismaDefaultTransactionConfigForWrite);

    return {};
  }
}
