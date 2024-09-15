import { inject, injectable } from "inversify";
import {
  ICourseScheduleAuthorization,
  ICourseScheduleRepository,
  ICourseScheduleService,
} from "../schedule.interface";
import {
  CourseScheduleDITypes,
  CourseScheduleModel,
  CourseScheduleResourceId,
} from "../schedule.type";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import { $CourseScheduleAPI } from "../schedule.api";

@injectable()
export default class CourseScheduleService implements ICourseScheduleService {
  @inject(CourseScheduleDITypes.REPOSITORY)
  private readonly repository: ICourseScheduleRepository;

  @inject(CourseScheduleDITypes.AUTHORIZATION)
  private readonly authorization: ICourseScheduleAuthorization;

  public async createSchedule(
    resourceId: CourseScheduleResourceId,
    dto: $CourseScheduleAPI.CreateSchedule.Dto,
  ): Promise<$CourseScheduleAPI.CreateSchedule.Response["data"]> {
    try {
      const { user, params } = resourceId;
      const { courseId } = params;

      await this.authorization.authorizeCreateSchedule(user, courseId);

      return this.repository.createSchedule(params, dto);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getSchedules(
    resourceId: CourseScheduleResourceId,
    query: $CourseScheduleAPI.GetSchedules.Query,
  ): Promise<$CourseScheduleAPI.GetSchedules.Response["data"]> {
    try {
      const {
        user,
        params: { courseId },
      } = resourceId;

      await this.authorization.authorizeReadSchedule(user, courseId);

      return this.repository.getSchedules({ courseId }, query);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getScheduleById(
    scheduleId: number,
    resourceId: CourseScheduleResourceId,
  ): Promise<CourseScheduleModel> {
    try {
      const { user, params } = resourceId;
      const { courseId } = params;

      await this.authorization.authorizeReadSchedule(user, courseId);

      return this.repository.getScheduleByIdOrThrow({
        scheduleId,
        resourceId: params,
      });
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async updateSchedule(
    scheduleId: number,
    resourceId: CourseScheduleResourceId,
    dto: $CourseScheduleAPI.UpdateSchedule.Dto,
  ): Promise<CourseScheduleModel> {
    try {
      const { user, params } = resourceId;
      const { courseId } = params;

      await this.authorization.authorizeUpdateSchedule(user, courseId);

      return this.repository.updateSchedule(
        { scheduleId, resourceId: params },
        dto,
      );
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async deleteSchedule(
    scheduleId: number,
    resourceId: CourseScheduleResourceId,
  ): Promise<$CourseScheduleAPI.DeleteSchedule.Response["data"]> {
    try {
      const { user, params } = resourceId;
      const { courseId } = params;

      await this.authorization.authorizeDeleteSchedule(user, courseId);

      return this.repository.deleteSchedule({ scheduleId, resourceId: params });
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }
}
