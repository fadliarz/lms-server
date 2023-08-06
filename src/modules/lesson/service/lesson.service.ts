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
import { Role } from "@prisma/client";
import { doMinimumRoleAuthorization } from "../../../common/functions/doMinimumRoleAuthorization";
import { AuthorizationException } from "../../../common/exceptions/AuthorizationException";

export interface ICourseLessonService {
  deleteLesson: (
    userId: string,
    params: CourseLessonParams,
  ) => Promise<CourseLessonModel>;
  updateLesson: (
    userId: string,
    params: CourseLessonParams,
    lessonDetails: UpdateCourseLessonDto
  ) => Promise<CourseLessonModel>;
  getLessonById: (lessonId: string) => Promise<CourseLessonModel>;
  createLesson: (
    userId: string,
    params: CourseLessonParams,
    lessonDetails: CreateCourseLessonDto
  ) => Promise<CourseLessonModel>;
}

@injectable()
export class CourseLessonService implements ICourseLessonService {
  @inject(CourseLessonDITypes.COURSE_LESSON_REPOSITORY)
  private readonly courseLessonRepository: ICourseLessonRepository;

  private async authorizeUserOnLessonByMinimumRole(
    userId: string,
    courseId: string,
    minimumRole: Role,
    lessonId?: string
  ): Promise<void> {
    const userRole = await this.courseLessonRepository.getUserCourseRole(
      userId,
      courseId
    );

    doMinimumRoleAuthorization(userRole, minimumRole);

    if (lessonId) {
      const isLessonBelongToCourse =
        await this.courseLessonRepository.isLessonBelongToCourse(
          lessonId,
          courseId
        );

      if (!isLessonBelongToCourse) {
        throw new AuthorizationException("Unathorized to update this lesson!");
      }
    }
  }

  public async deleteLesson(
    userId: string,
    params: CourseLessonParams,
  ): Promise<CourseLessonModel> {
    try {
      await this.authorizeUserOnLessonByMinimumRole(
        userId,
        params.courseId,
        Role.INSTRUCTOR,
        params.lessonId
      );

      const deletedLesson = await this.courseLessonRepository.deleteLesson(
        params.lessonId
      );

      return getValuable(deletedLesson);
    } catch (error) {
      throw error;
    }
  }

  public async updateLesson(
    userId: string,
    params: CourseLessonParams,
    lessonDetails: UpdateCourseLessonDto
  ): Promise<CourseLessonModel> {
    try {
      await this.authorizeUserOnLessonByMinimumRole(
        userId,
        params.courseId,
        Role.INSTRUCTOR,
        params.lessonId
      );

      const updatedLesson = await this.courseLessonRepository.updateLesson(
        params.lessonId,
        lessonDetails
      );

      return getValuable(updatedLesson);
    } catch (error) {
      throw error;
    }
  }

  public async createLesson(
    userId: string,
    params: CourseLessonParams,
    lessonDetails: CreateCourseLessonDto
  ): Promise<CourseLessonModel> {
    try {
      await this.authorizeUserOnLessonByMinimumRole(
        userId,
        params.courseId,
        Role.INSTRUCTOR
      );

      const lesson = await this.courseLessonRepository.createLesson(
        params.courseId,
        lessonDetails
      );

      return getValuable(lesson);
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
}
