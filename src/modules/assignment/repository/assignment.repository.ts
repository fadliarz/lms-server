import { injectable } from "inversify";
import {
  CourseClassAssignmentModel,
  CourseClassAssignmentResourceId,
} from "../assignment.type";
import { ICourseClassAssignmentRepository } from "../assignment.interface";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import BaseRepository from "../../../common/class/BaseRepository";
import { $CourseClassAssignmentAPI } from "../assignment.api";

@injectable()
export default class CourseClassAssignmentRepository
  extends BaseRepository
  implements ICourseClassAssignmentRepository
{
  constructor() {
    super();
  }

  public async createAssignment(
    id: {
      classId: number;
      resourceId?: Omit<CourseClassAssignmentResourceId, "classId">;
    },
    data: $CourseClassAssignmentAPI.CreateAssignment.Dto,
  ): Promise<CourseClassAssignmentModel> {
    if (id.resourceId) {
      const theClass = await this.db.courseClass.findFirst({
        where: {
          id: id.classId,
          course: {
            id: id.resourceId.courseId,
          },
        },
        select: {},
      });

      if (theClass === null) {
        throw new RecordNotFoundException();
      }
    }

    return this.db.courseClassAssignment.create({
      data: { ...data, classId: id.classId },
    });
  }

  public async getAssignments(id: {
    classId: number;
    resourceId?: Omit<CourseClassAssignmentResourceId, "classId">;
  }): Promise<CourseClassAssignmentModel[]> {
    return this.db.courseClassAssignment.findMany({
      where: this.getWhereObjectForFirstLevelOperation(id),
    });
  }

  public async getAssignmentById(id: {
    assignmentId: number;
    resourceId?: CourseClassAssignmentResourceId;
  }): Promise<CourseClassAssignmentModel | null> {
    return this.db.courseClassAssignment.findFirst({
      where: this.getWhereObjectForSecondLevelOperation(id),
    });
  }

  public async getAssignmentByIdOrThrow(
    id: {
      assignmentId: number;
      resourceId?: CourseClassAssignmentResourceId;
    },
    error?: Error,
  ): Promise<CourseClassAssignmentModel> {
    const assignment = await this.getAssignmentById(id);

    if (!assignment) {
      throw error || new RecordNotFoundException();
    }

    return assignment;
  }

  public async updateAssignment(
    id: {
      assignmentId: number;
      resourceId?: CourseClassAssignmentResourceId;
    },
    data: Partial<CourseClassAssignmentModel>,
  ): Promise<CourseClassAssignmentModel> {
    return this.db.courseClassAssignment.update({
      where: this.getWhereObjectForSecondLevelOperation(id),
      data,
    });
  }

  public async deleteAssignment(id: {
    assignmentId: number;
    resourceId: CourseClassAssignmentResourceId;
  }): Promise<{}> {
    return this.db.courseClassAssignment.delete({
      where: this.getWhereObjectForSecondLevelOperation(id),
    });
  }

  private getWhereObjectForFirstLevelOperation(id: {
    classId: number;
    resourceId?: Omit<CourseClassAssignmentResourceId, "classId">;
  }):
    | {
        id: number;
      }
    | {
        id: number;
        course: {
          id: number;
        };
      } {
    if (id.resourceId) {
      return {
        id: id.classId,
        course: {
          id: id.resourceId.courseId,
        },
      };
    }

    return {
      id: id.classId,
    };
  }

  private getWhereObjectForSecondLevelOperation(id: {
    assignmentId: number;
    resourceId?: CourseClassAssignmentResourceId;
  }):
    | { id: number }
    | { id: number; courseClass: { id: number; course: { id: number } } } {
    const { assignmentId, resourceId } = id;

    if (resourceId) {
      return {
        id: assignmentId,
        courseClass: {
          id: resourceId.classId,
          course: { id: resourceId.courseId },
        },
      };
    }

    return { id: assignmentId };
  }
}
