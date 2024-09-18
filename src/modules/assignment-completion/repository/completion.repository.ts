import { injectable } from "inversify";
import BaseRepository from "../../../common/class/BaseRepository";
import { ICourseClassAssignmentCompletionRepository } from "../completion.interface";
import {
  CourseClassAssignmentCompletionModel,
  CourseClassAssignmentCompletionResourceId,
} from "../completion.type";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import { $CourseClassAssignmentCompletionAPI } from "../completion.api";

@injectable()
export default class CourseClassAssigmentCompletionRepository
  extends BaseRepository
  implements ICourseClassAssignmentCompletionRepository
{
  constructor() {
    super();
  }

  public async createCompletion(
    id: {
      assignmentId: number;
      resourceId?: Omit<
        CourseClassAssignmentCompletionResourceId,
        "assignmentId"
      >;
    },
    data: $CourseClassAssignmentCompletionAPI.CreateCompletion.Dto,
  ): Promise<CourseClassAssignmentCompletionModel> {
    if (id.resourceId) {
      const assignment = await this.db.courseClassAssignment.findFirst({
        where: {
          id: id.assignmentId,
          courseClass: {
            id: id.resourceId.classId,
            courseId: id.resourceId.courseId,
          },
        },
        select: { id: true },
      });

      if (assignment === null) {
        throw new RecordNotFoundException();
      }
    }

    return this.db.courseClassAssignmentCompletion.create({
      data: { ...data, assignmentId: id.assignmentId },
    });
  }

  public async getCompletionById(id: {
    completionId: number;
    resourceId?: CourseClassAssignmentCompletionResourceId;
  }): Promise<CourseClassAssignmentCompletionModel | null> {
    return this.db.courseClassAssignmentCompletion.findFirst({
      where: this.getWhereObject(id),
    });
  }

  public async updateCompletion(
    id: {
      completionId: number;
      resourceId?: CourseClassAssignmentCompletionResourceId;
    },
    dto: Partial<CourseClassAssignmentCompletionModel>,
  ): Promise<CourseClassAssignmentCompletionModel> {
    return this.db.courseClassAssignmentCompletion.update({
      where: this.getWhereObject(id),
      data: dto,
    });
  }

  public async deleteCompletion(id: {
    completionId: number;
    resourceId?: CourseClassAssignmentCompletionResourceId;
  }): Promise<{ id: number }> {
    return this.db.courseClassAssignmentCompletion.delete({
      where: this.getWhereObject(id),
      select: {
        id: true,
      },
    });
  }

  private getWhereObject(id: {
    completionId: number;
    resourceId?: CourseClassAssignmentCompletionResourceId;
  }):
    | { id: number }
    | {
        id: number;
        assignment: {
          id: number;
          class: {
            id: number;
            course: { id: number };
          };
        };
      } {
    if (id.resourceId) {
      return {
        id: id.completionId,
        assignment: {
          id: id.resourceId.assignmentId,
          class: {
            id: id.resourceId.classId,
            course: { id: id.resourceId.courseId },
          },
        },
      };
    }

    return { id: id.completionId };
  }
}
