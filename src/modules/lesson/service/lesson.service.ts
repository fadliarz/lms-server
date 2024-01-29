import { inject, injectable } from "inversify";
import {
  CourseLessonDITypes,
  CourseLessonModel,
  CourseLessonResourceId,
  CreateCourseLessonDto,
  UpdateCourseLessonDto,
} from "../lesson.type";
import { ICourseLessonRepository } from "../repository/lesson.repository";
import getValuable from "../../../common/functions/getValuable";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";

export interface ICourseLessonService {
  createLesson: (
    resourceId: CourseLessonResourceId,
    dto: CreateCourseLessonDto,
  ) => Promise<CourseLessonModel>;
  getLessonById: (
    lessonId: number,
    resourceId: CourseLessonResourceId,
  ) => Promise<CourseLessonModel>;
  updateLesson: (
    lessonId: number,
    resourceId: CourseLessonResourceId,
    dto: UpdateCourseLessonDto,
  ) => Promise<CourseLessonModel>;
  deleteLesson: (
    lessonId: number,
    resourceId: CourseLessonResourceId,
  ) => Promise<{}>;
}

@injectable()
export class CourseLessonService implements ICourseLessonService {
  @inject(CourseLessonDITypes.REPOSITORY)
  private readonly repository: ICourseLessonRepository;

  public async createLesson(
    resourceId: CourseLessonResourceId,
    dto: CreateCourseLessonDto,
  ): Promise<CourseLessonModel> {
    const lesson = await this.repository.createLesson(resourceId, dto);

    return getValuable(lesson);
  }

  public async getLessonById(
    lessonId: number,
    resourceId: CourseLessonResourceId,
  ): Promise<CourseLessonModel> {
    const { courseId } = resourceId;
    const lesson = await this.repository.getLessonByIdOrThrow(lessonId);
    if (!lesson || lesson.courseId !== courseId) {
      throw new RecordNotFoundException();
    }

    return getValuable(lesson);
  }

  public async updateLesson(
    lessonId: number,
    resourceId: CourseLessonResourceId,
    dto: UpdateCourseLessonDto,
  ): Promise<CourseLessonModel> {
    const { courseId } = resourceId;
    const lesson = await this.repository.getLessonById(lessonId);
    if (!lesson || lesson.courseId !== courseId) {
      throw new RecordNotFoundException();
    }

    const updatedLesson = await this.repository.updateLesson(
      lessonId,
      resourceId,
      dto,
    );

    return getValuable(updatedLesson);
  }

  public async deleteLesson(
    lessonId: number,
    resourceId: CourseLessonResourceId,
  ): Promise<{}> {
    const { courseId } = resourceId;
    const lesson = await this.repository.getLessonById(lessonId);
    if (!lesson || lesson.courseId !== courseId) {
      throw new RecordNotFoundException();
    }

    await this.repository.deleteLesson(lessonId, resourceId);

    return {};
  }
}
