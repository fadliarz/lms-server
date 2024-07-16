import { inject, injectable } from "inversify";
import {
  CourseClassDITypes,
  CourseClassModel,
  CourseClassResourceId,
  CreateCourseClassDto,
  ICourseClassRepository,
  ICourseClassService,
  UpdateCourseClassDto,
} from "../class.type";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import { UnauthenticatedResourceId } from "../../../common/types";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";

@injectable()
export default class CourseClassService implements ICourseClassService {
  @inject(CourseClassDITypes.REPOSITORY)
  private readonly repository: ICourseClassRepository;

  public async createClass(
    resourceId: CourseClassResourceId,
    dto: CreateCourseClassDto,
  ): Promise<CourseClassModel> {
    try {
      return await this.repository.createClass(resourceId, dto);
    } catch (error: any) {
      throw handleRepositoryError(error, {
        foreignConstraint: {
          default: { message: "Course doesn't exist!" },
        },
      });
    }
  }

  public async getClassById(
    classId: number,
    resourceId: UnauthenticatedResourceId<CourseClassResourceId>,
  ): Promise<CourseClassModel> {
    const theClass = await this.validateRelationBetweenResources({
      classId,
      resourceId,
    });

    return theClass;
  }

  public async getClasses(
    resourceId: UnauthenticatedResourceId<CourseClassResourceId>,
  ): Promise<CourseClassModel[]> {
    return await this.repository.getClasses(resourceId);
  }

  public async updateClass(
    classId: number,
    resourceId: CourseClassResourceId,
    dto: UpdateCourseClassDto,
  ): Promise<CourseClassModel> {
    await this.validateRelationBetweenResources({ classId, resourceId });

    return await this.repository.updateClass(classId, resourceId, dto);
  }

  public async deleteClass(
    classId: number,
    resourceId: CourseClassResourceId,
  ): Promise<{}> {
    await this.validateRelationBetweenResources({ classId, resourceId });

    await this.repository.deleteClass(classId, resourceId);

    return {};
  }

  private async validateRelationBetweenResources(id: {
    classId: number;
    resourceId: UnauthenticatedResourceId<CourseClassResourceId>;
  }): Promise<CourseClassModel> {
    const { classId, resourceId } = id;
    const { courseId } = resourceId;
    const theClass = await this.repository.getClassById(classId, resourceId);

    if (!theClass || theClass.courseId !== courseId) {
      throw new RecordNotFoundException();
    }

    return theClass;
  }
}
