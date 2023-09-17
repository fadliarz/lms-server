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
  delete: (lessonId: number, courseId: number) => Promise<CourseLessonModel>;
  update: (
    lessonId: number,
    lessonDetails: UpdateCourseLessonDto
  ) => Promise<CourseLessonModel>;
  getById: (lessonId: number) => Promise<CourseLessonModel>;
  create: (lessonDetails: CreateCourseLessonDto) => Promise<CourseLessonModel>;
}

@injectable()
export class CourseLessonService implements ICourseLessonService {
  @inject(CourseLessonDITypes.REPOSITORY)
  private readonly repository: ICourseLessonRepository;

  public async delete(
    lessonId: number,
    courseId: number
  ): Promise<CourseLessonModel> {
    const deletedLesson = await this.repository.delete(lessonId, courseId);

    return getValuable(deletedLesson);
  }

  public async update(
    lessonId: number,
    lessonDetails: UpdateCourseLessonDto
  ): Promise<CourseLessonModel> {
    const updatedLesson = await this.repository.update(lessonId, lessonDetails);

    return getValuable(updatedLesson);
  }

  public async getById(lessonId: number): Promise<CourseLessonModel> {
    const lesson = await this.repository.getById(lessonId);

    return getValuable(lesson);
  }

  public async create(
    lessonDetails: CreateCourseLessonDto
  ): Promise<CourseLessonModel> {
    const lesson = await this.repository.create(lessonDetails);

    return getValuable(lesson);
  }
}
