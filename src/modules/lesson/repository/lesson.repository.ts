import "reflect-metadata";
import { CourseLessonModel, CourseLessonResourceId } from "../lesson.type";
import { injectable } from "inversify";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import { ICourseLessonRepository } from "../lesson.interface";
import BaseRepository from "../../../common/class/BaseRepository";
import { CourseScheduleResourceId } from "../../schedule/schedule.type";
import { $CourseLessonAPI } from "../lesson.api";
import getQueryExtendsObject from "../../../common/functions/getQueryExtendObject";

@injectable()
export default class CourseLessonRepository
  extends BaseRepository
  implements ICourseLessonRepository
{
  constructor() {
    super();
  }

  public async createLesson(
    id: {
      courseId: number;
    },
    data: $CourseLessonAPI.CreateLesson.Dto,
  ): Promise<CourseLessonModel> {
    return this.db.courseLesson.create({
      data: {
        ...data,
        courseId: id.courseId,
      },
    });
  }

  public async getLessonById(id: {
    lessonId: number;
    resourceId?: CourseLessonResourceId;
  }): Promise<CourseLessonModel | null> {
    return this.db.courseLesson.findFirst({
      where: this.getWhereObject(id),
    });
  }

  public async getLessonByIdOrThrow(
    id: {
      lessonId: number;
      resourceId?: CourseLessonResourceId;
    },
    error?: Error,
  ): Promise<CourseLessonModel> {
    const lesson = await this.getLessonById(id);

    if (!lesson) {
      throw error || new RecordNotFoundException();
    }

    return lesson;
  }

  public async getLessons(
    id: {
      courseId: number;
    },
    query?: $CourseLessonAPI.GetLessons.Query,
  ): Promise<CourseLessonModel[]> {
    return this.db.courseLesson.findMany({
      where: { courseId: id.courseId },
      ...getQueryExtendsObject(query),
    });
  }

  public async updateLesson(
    id: {
      lessonId: number;
      resourceId?: CourseLessonResourceId;
    },
    data: Partial<CourseLessonModel>,
  ): Promise<CourseLessonModel> {
    return this.db.courseLesson.update({
      where: this.getWhereObject(id),
      data: data,
    });
  }

  public async deleteLesson(id: {
    lessonId: number;
    resourceId: CourseLessonResourceId;
  }): Promise<{ id: number }> {
    return this.db.courseLesson.delete({
      where: this.getWhereObject(id),
      select: { id: true },
    });
  }

  private getWhereObject(id: {
    lessonId: number;
    resourceId?: CourseScheduleResourceId["params"];
  }): { id: number } | { id: number; course: { id: number } } {
    const { lessonId, resourceId } = id;

    return resourceId
      ? { id: lessonId, course: { id: resourceId.courseId } }
      : { id: lessonId };
  }
}
