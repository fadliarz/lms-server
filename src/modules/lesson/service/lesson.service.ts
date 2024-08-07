import { inject, injectable } from "inversify";
import {
  CourseLessonDITypes,
  CourseLessonModel,
  CourseLessonResourceId,
  CreateCourseLessonDto,
  UpdateBasicCourseLessonDto,
} from "../lesson.type";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import {
  ICourseLessonRepository,
  ICourseLessonService,
} from "../lesson.interface";
import { UnauthenticatedResourceId } from "../../../common/types";

@injectable()
export default class CourseLessonService implements ICourseLessonService {
  @inject(CourseLessonDITypes.REPOSITORY)
  private readonly repository: ICourseLessonRepository;

  public async createLesson(
    resourceId: CourseLessonResourceId,
    dto: CreateCourseLessonDto,
  ): Promise<CourseLessonModel> {
    try {
      return await this.repository.createLesson(resourceId, dto);
    } catch (error: any) {
      throw handleRepositoryError(error, {
        foreignConstraint: {
          default: { message: "Course doesn't exist!" },
        },
      });
    }
  }

  public async getLessonById(
    lessonId: number,
    resourceId: UnauthenticatedResourceId<CourseLessonResourceId>,
  ): Promise<CourseLessonModel> {
    const lesson = await this.validateRelationBetweenResources({
      lessonId,
      resourceId,
    });

    return lesson;
  }

  public async getLessons(
    resourceId: UnauthenticatedResourceId<CourseLessonResourceId>,
  ): Promise<CourseLessonModel[]> {
    return await this.repository.getLessons(resourceId);
  }

  public async updateBasicLesson(
    lessonId: number,
    resourceId: CourseLessonResourceId,
    dto: UpdateBasicCourseLessonDto,
  ): Promise<CourseLessonModel> {
    await this.validateRelationBetweenResources({ lessonId, resourceId });

    return await this.repository.updateLesson(lessonId, resourceId, dto);
  }

  public async deleteLesson(
    lessonId: number,
    resourceId: CourseLessonResourceId,
  ): Promise<{}> {
    await this.validateRelationBetweenResources({ lessonId, resourceId });

    await this.repository.deleteLesson(lessonId, resourceId);

    return {};
  }

  public async validateRelationBetweenResources(id: {
    lessonId: number;
    resourceId: UnauthenticatedResourceId<CourseLessonResourceId>;
  }): Promise<CourseLessonModel> {
    const { lessonId, resourceId } = id;
    const { courseId } = resourceId;
    const lesson = await this.repository.getLessonById(lessonId, resourceId);

    if (!lesson || lesson.courseId !== courseId) {
      throw new RecordNotFoundException();
    }

    return lesson;
  }
}
