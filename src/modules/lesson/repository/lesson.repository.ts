import "reflect-metadata";
import {
  $CourseLessonAPI,
  CourseLessonModel,
  CourseLessonResourceId,
} from "../lesson.type";
import { injectable } from "inversify";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import { ICourseLessonRepository } from "../lesson.interface";
import BaseRepository from "../../../common/class/BaseRepository";
import { CourseScheduleResourceId } from "../../schedule/schedule.type";

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
    return this.db.courseLesson.findUnique({
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

  public async getLessons(id: {
    courseId: number;
  }): Promise<CourseLessonModel[]> {
    return this.db.courseLesson.findMany({
      where: {
        id: id.courseId,
      },
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
  }): Promise<{}> {
    return this.db.courseLesson.delete({
      where: this.getWhereObject(id),
      select: {},
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
