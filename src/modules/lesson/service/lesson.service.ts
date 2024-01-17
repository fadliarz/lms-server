import { inject, injectable } from "inversify";
import {
  CourseLessonDITypes,
  CourseLessonModel,
  CreateCourseLessonDto,
  UpdateCourseLessonDto,
} from "../lesson.type";
import { ICourseLessonRepository } from "../repository/lesson.repository";
import getValuable from "../../../common/functions/getValuable";

export interface ICourseLessonService {
  createLesson: (
    courseId: number,
    dto: CreateCourseLessonDto
  ) => Promise<CourseLessonModel>;
  getLessonById: (
    courseId: number,
    lessonId: number
  ) => Promise<CourseLessonModel>;
  updateLesson: (
    lessonId: number,
    dto: UpdateCourseLessonDto
  ) => Promise<CourseLessonModel>;
  deleteLesson: (courseId: number, lessonId: number) => Promise<{}>;
}

@injectable()
export class CourseLessonService implements ICourseLessonService {
  @inject(CourseLessonDITypes.REPOSITORY)
  private readonly repository: ICourseLessonRepository;

  public async createLesson(
    courseId: number,
    dto: CreateCourseLessonDto
  ): Promise<CourseLessonModel> {
    const lesson = await this.repository.createLesson(courseId, dto);

    return getValuable(lesson);
  }

  public async getLessonById(
    courseId: number,
    lessonId: number
  ): Promise<CourseLessonModel> {
    const lesson = await this.repository.getLessonById(courseId, lessonId);

    return getValuable(lesson);
  }

  public async updateLesson(
    lessonId: number,
    dto: UpdateCourseLessonDto
  ): Promise<CourseLessonModel> {
    const updatedLesson = await this.repository.updateLesson(lessonId, dto);

    return getValuable(updatedLesson);
  }

  public async deleteLesson(courseId: number, lessonId: number): Promise<{}> {
    await this.repository.deleteLesson(courseId, lessonId);

    return {};
  }
}
