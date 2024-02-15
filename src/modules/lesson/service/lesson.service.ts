import { inject, injectable } from "inversify";
import {
  CourseLessonDITypes,
  CourseLessonModel,
  CourseLessonResourceId,
  CreateCourseLessonDto,
  UpdateCourseLessonDto,
} from "../lesson.type";
import { ICourseLessonRepository } from "../repository/lesson.repository";
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
  validateRelationBetweenResources: (
    id: {
      lessonId: number;
      resourceId: CourseLessonResourceId;
    },
    error?: Error,
  ) => Promise<CourseLessonModel | null>;
}

@injectable()
export class CourseLessonService implements ICourseLessonService {
  @inject(CourseLessonDITypes.REPOSITORY)
  private readonly repository: ICourseLessonRepository;

  public async createLesson(
    resourceId: CourseLessonResourceId,
    dto: CreateCourseLessonDto,
  ): Promise<CourseLessonModel> {
    return await this.repository.createLesson(resourceId, dto);
  }

  public async getLessonById(
    lessonId: number,
    resourceId: CourseLessonResourceId,
  ): Promise<CourseLessonModel> {
    const lesson = await this.validateRelationBetweenResources({
      lessonId,
      resourceId,
    });

    if (!lesson) {
      throw new RecordNotFoundException();
    }

    return lesson;
  }

  public async updateLesson(
    lessonId: number,
    resourceId: CourseLessonResourceId,
    dto: UpdateCourseLessonDto,
  ): Promise<CourseLessonModel> {
    await this.validateRelationBetweenResources(
      { lessonId, resourceId },
      new RecordNotFoundException(),
    );

    return await this.repository.updateLesson(lessonId, resourceId, dto);
  }

  public async deleteLesson(
    lessonId: number,
    resourceId: CourseLessonResourceId,
  ): Promise<{}> {
    await this.validateRelationBetweenResources(
      { lessonId, resourceId },
      new RecordNotFoundException(),
    );
    await this.repository.deleteLesson(lessonId, resourceId);

    return {};
  }

  public async validateRelationBetweenResources(
    id: {
      lessonId: number;
      resourceId: CourseLessonResourceId;
    },
    error?: Error,
  ): Promise<CourseLessonModel | null> {
    const { lessonId, resourceId } = id;
    const lesson = await this.repository.getLessonById(lessonId, resourceId);

    if (!lesson) {
      if (error) {
        throw error;
      }
    }

    return lesson;
  }
}
