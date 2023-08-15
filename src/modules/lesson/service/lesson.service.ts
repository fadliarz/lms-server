import { inject, injectable } from "inversify";
import {
  CourseLessonDITypes,
  CourseLessonModel,
  CreateCourseLessonDto,
  UpdateCourseLessonDto,
} from "../lesson.type";
import { ICourseLessonRepository } from "../repository/lesson.repository";
import { getValuable } from "../../../common/functions/getValuable";

export interface ICourseLessonService {
  deleteLesson: (
    lessonId: number,
    courseId: number
  ) => Promise<CourseLessonModel>;
  updateLesson: (
    lessonId: number,
    courseId: number,
    lessonDetails: UpdateCourseLessonDto
  ) => Promise<CourseLessonModel>;
  getLessonById: (lessonId: number) => Promise<CourseLessonModel>;
  createLesson: (
    courseId: number,
    lessonDetails: CreateCourseLessonDto
  ) => Promise<CourseLessonModel>;
}

@injectable()
export class CourseLessonService implements ICourseLessonService {
  @inject(CourseLessonDITypes.REPOSITORY)
  private readonly courseLessonRepository: ICourseLessonRepository;

  public async deleteLesson(
    lessonId: number,
    courseId: number
  ): Promise<CourseLessonModel> {
    try {
      const deletedLesson = await this.courseLessonRepository.deleteLesson(
        lessonId,
        courseId
      );

      return getValuable(deletedLesson);
    } catch (error) {
      throw error;
    }
  }

  public async updateLesson(
    lessonId: number,
    courseId: number,
    lessonDetails: UpdateCourseLessonDto
  ): Promise<CourseLessonModel> {
    try {
      const updatedLesson = await this.courseLessonRepository.updateLesson(
        lessonId,
        courseId,
        lessonDetails
      );

      return getValuable(updatedLesson);
    } catch (error) {
      throw error;
    }
  }

  public async getLessonById(lessonId: number): Promise<CourseLessonModel> {
    try {
      const lesson = await this.courseLessonRepository.getLessonById(lessonId);

      return getValuable(lesson);
    } catch (error) {
      throw error;
    }
  }

  public async createLesson(
    courseId: number,
    lessonDetails: CreateCourseLessonDto
  ): Promise<CourseLessonModel> {
    try {
      const lesson = await this.courseLessonRepository.createLesson(
        courseId,
        lessonDetails
      );

      return getValuable(lesson);
    } catch (error) {
      throw error;
    }
  }
}
