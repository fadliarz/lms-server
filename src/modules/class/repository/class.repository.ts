import { injectable } from "inversify";
import { CourseClassModel, CourseClassResourceId } from "../class.type";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import { ICourseClassRepository } from "../class.interface";
import BaseRepository from "../../../common/class/BaseRepository";
import { $CourseClassAPI } from "../class.api";

@injectable()
export default class CourseClassRepository
  extends BaseRepository
  implements ICourseClassRepository
{
  constructor() {
    super();
  }

  public async createClass(
    id: {
      courseId: number;
    },
    data: $CourseClassAPI.CreateClass.Dto,
  ): Promise<CourseClassModel> {
    return this.db.courseClass.create({
      data: {
        ...data,
        courseId: id.courseId,
      },
    });
  }

  public async getClasses(id: {
    courseId: number;
  }): Promise<CourseClassModel[]> {
    return this.db.courseClass.findMany({
      where: this.getWhereObjectForFirstLevelOperation(id),
    });
  }

  public async getClassById(id: {
    classId: number;
    resourceId?: CourseClassResourceId;
  }): Promise<CourseClassModel | null> {
    return this.db.courseClass.findFirst({
      where: this.getWhereObjectForSecondLevelOperation(id),
    });
  }

  public async getClassByIdOrThrow(
    id: {
      classId: number;
      resourceId?: CourseClassResourceId;
    },
    error?: Error,
  ): Promise<CourseClassModel> {
    const theClass = await this.getClassById(id);

    if (!theClass) {
      throw error || new RecordNotFoundException();
    }

    return theClass;
  }

  public async updateClass(
    id: {
      classId: number;
      resourceId?: CourseClassResourceId;
    },
    data: Partial<CourseClassModel>,
  ): Promise<CourseClassModel> {
    return this.db.courseClass.update({
      where: this.getWhereObjectForSecondLevelOperation(id),
      data,
    });
  }

  public async deleteClass(id: {
    classId: number;
    resourceId: CourseClassResourceId;
  }): Promise<{}> {
    return this.db.courseClass.delete({
      where: this.getWhereObjectForSecondLevelOperation(id),
      select: {},
    });
  }

  private getWhereObjectForFirstLevelOperation(id: { courseId: number }): {
    courseId: number;
  } {
    return id;
  }

  private getWhereObjectForSecondLevelOperation(id: {
    classId: number;
    resourceId?: CourseClassResourceId;
  }): { id: number } | { id: number; course: { id: number } } {
    const { classId, resourceId } = id;

    return resourceId
      ? { id: classId, course: { id: resourceId.courseId } }
      : { id: classId };
  }
}
