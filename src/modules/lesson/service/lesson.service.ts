import { inject, injectable } from "inversify";
import {
  CourseLessonDITypes,
  CourseLessonModel,
  CourseLessonParams,
  CreateCourseLessonDto,
  UpdateCourseLessonDto,
} from "../lesson.type";
import { ICourseLessonRepository } from "../repository/lesson.repository";
import { getValuable } from "../../../common/functions/getValuable";

export interface ICourseLessonService {
  deleteLesson: (params: CourseLessonParams) => Promise<CourseLessonModel>;
  updateLesson: (
    params: CourseLessonParams,
    lessonDetails: UpdateCourseLessonDto
  ) => Promise<CourseLessonModel>;
  getLessonById: (lessonId: string) => Promise<CourseLessonModel>;
  createLesson: (
    params: CourseLessonParams,
    lessonDetails: CreateCourseLessonDto
  ) => Promise<CourseLessonModel>;
}

@injectable()
export class CourseLessonService implements ICourseLessonService {
  @inject(CourseLessonDITypes.COURSE_LESSON_REPOSITORY)
  private readonly courseLessonRepository: ICourseLessonRepository;

  public async deleteLesson(
    params: CourseLessonParams
  ): Promise<CourseLessonModel> {
    try {
      const deletedLesson = await this.courseLessonRepository.deleteLesson(
        params.lessonId
      );

      return getValuable(deletedLesson);
    } catch (error) {
      throw error;
    }
  }

  public async updateLesson(
    params: CourseLessonParams,
    lessonDetails: UpdateCourseLessonDto
  ): Promise<CourseLessonModel> {
    try {
      const updatedLesson = await this.courseLessonRepository.updateLesson(
        params.lessonId,
        lessonDetails
      );

      return getValuable(updatedLesson);
    } catch (error) {
      throw error;
    }
  }

  public async getLessonById(lessonId: string): Promise<CourseLessonModel> {
    try {
      const lesson = await this.courseLessonRepository.getLessonById(lessonId);

      return getValuable(lesson);
    } catch (error) {
      throw error;
    }
  }

  public async createLesson(
    params: CourseLessonParams,
    lessonDetails: CreateCourseLessonDto
  ): Promise<CourseLessonModel> {
    try {
      const lesson = await this.courseLessonRepository.createLesson(
        params.courseId,
        lessonDetails
      );

      return getValuable(lesson);
    } catch (error) {
      throw error;
    }
  }
}
