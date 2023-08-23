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
    courseId: number,
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
    try {
      const deletedLesson = await this.repository.delete(lessonId, courseId);

      return getValuable(deletedLesson);
    } catch (error) {
      throw error;
    }
  }

  public async update(
    lessonId: number,
    courseId: number,
    lessonDetails: UpdateCourseLessonDto
  ): Promise<CourseLessonModel> {
    try {
      const updatedLesson = await this.repository.update(
        lessonId,
        courseId,
        lessonDetails
      );

      return getValuable(updatedLesson);
    } catch (error) {
      throw error;
    }
  }

  public async getById(lessonId: number): Promise<CourseLessonModel> {
    try {
      const lesson = await this.repository.getById(lessonId);

      return getValuable(lesson);
    } catch (error) {
      throw error;
    }
  }

  public async create(
    lessonDetails: CreateCourseLessonDto
  ): Promise<CourseLessonModel> {
    try {
      const lesson = await this.repository.create(lessonDetails);

      return getValuable(lesson);
    } catch (error) {
      throw error;
    }
  }
}
