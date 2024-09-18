import { injectable } from "inversify";
import BaseRepository from "../../../common/class/BaseRepository";
import {
  CourseScheduleModel,
  CourseScheduleResourceId,
} from "../schedule.type";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import { ICourseScheduleRepository } from "../schedule.interface";
import { $CourseScheduleAPI } from "../schedule.api";
import getQueryExtendsObject from "../../../common/functions/getQueryExtendObject";

@injectable()
export default class CourseScheduleRepository
  extends BaseRepository
  implements ICourseScheduleRepository
{
  constructor() {
    super();
  }

  public async createSchedule(
    id: CourseScheduleResourceId["params"],
    data: $CourseScheduleAPI.CreateSchedule.Dto,
  ): Promise<CourseScheduleModel> {
    return this.db.courseSchedule.create({
      data: { ...data, ...this.getWhereObjectForFirstLevelOperation(id) },
    });
  }

  public async getSchedules(
    id: CourseScheduleResourceId["params"],
    query?: $CourseScheduleAPI.GetSchedules.Query,
  ): Promise<CourseScheduleModel[]> {
    return this.db.courseSchedule.findMany({
      where: this.getWhereObjectForFirstLevelOperation(id),
      ...getQueryExtendsObject(query),
    });
  }

  public async getScheduleById(id: {
    scheduleId: number;
    resourceId?: CourseScheduleResourceId["params"];
  }): Promise<CourseScheduleModel | null> {
    return this.db.courseSchedule.findFirst({
      where: this.getWhereObjectForSecondLevelOperation(id),
    });
  }

  public async getScheduleByIdOrThrow(
    id: {
      scheduleId: number;
      resourceId?: CourseScheduleResourceId["params"];
    },
    error?: Error,
  ): Promise<CourseScheduleModel> {
    const schedule = await this.getScheduleById(id);

    if (!schedule) {
      throw error || new RecordNotFoundException();
    }

    return schedule;
  }

  public async updateSchedule(
    id: {
      scheduleId: number;
      resourceId?: CourseScheduleResourceId["params"];
    },
    data: Partial<CourseScheduleModel>,
  ): Promise<CourseScheduleModel> {
    return this.db.courseSchedule.update({
      where: this.getWhereObjectForSecondLevelOperation(id),
      data,
    });
  }

  public async deleteSchedule(id: {
    scheduleId: number;
    resourceId?: CourseScheduleResourceId["params"];
  }): Promise<{ id: number }> {
    return this.db.courseSchedule.delete({
      where: this.getWhereObjectForSecondLevelOperation(id),
    });
  }

  private getWhereObjectForFirstLevelOperation(id: { courseId: number }): {
    courseId: number;
  } {
    return id;
  }

  private getWhereObjectForSecondLevelOperation(id: {
    scheduleId: number;
    resourceId?: CourseScheduleResourceId["params"];
  }): { id: number } | { id: number; course: { id: number } } {
    const { scheduleId, resourceId } = id;

    return resourceId
      ? { id: scheduleId, course: { id: resourceId.courseId } }
      : { id: scheduleId };
  }
}
