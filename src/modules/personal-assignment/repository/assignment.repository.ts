import BaseRepository from "../../../common/class/BaseRepository";
import { IPersonalAssignmentRepository } from "../assignment.interface";
import { injectable } from "inversify";
import {
  PersonalAssignmentModel,
  PersonalAssignmentResourceId,
} from "../assignment.type";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import { $PersonalAssignmentAPI } from "../assignment.api";

@injectable()
export default class PersonalAssignmentRepository
  extends BaseRepository
  implements IPersonalAssignmentRepository
{
  constructor() {
    super();
  }

  public async createAssignment(
    id: {
      userId: number;
    },
    data: $PersonalAssignmentAPI.CreateAssignment.Dto,
  ): Promise<PersonalAssignmentModel> {
    return this.db.personalAssignment.create({
      data: { ...data, userId: id.userId },
    });
  }

  public async getAssignments(id: {
    userId: number;
  }): Promise<PersonalAssignmentModel[]> {
    return this.db.personalAssignment.findMany({
      where: {
        userId: id.userId,
      },
    });
  }

  public async getAssignmentById(id: {
    assignmentId: number;
    resourceId?: PersonalAssignmentResourceId;
  }): Promise<PersonalAssignmentModel | null> {
    return this.db.personalAssignment.findFirst({
      where: this.getWhereObject(id),
    });
  }

  public async getAssignmentByIdOrThrow(
    id: {
      assignmentId: number;
      resourceId?: PersonalAssignmentResourceId;
    },
    error?: Error,
  ): Promise<PersonalAssignmentModel> {
    const assignment = await this.getAssignmentById(id);

    if (!assignment) {
      throw error || new RecordNotFoundException();
    }

    return assignment;
  }

  public async updateAssignment(
    id: {
      assignmentId: number;
      resourceId?: PersonalAssignmentResourceId;
    },
    data: Partial<PersonalAssignmentModel>,
  ): Promise<PersonalAssignmentModel> {
    return this.db.personalAssignment.update({
      where: this.getWhereObject(id),
      data,
    });
  }

  public async deleteAssignment(id: {
    assignmentId: number;
    resourceId?: PersonalAssignmentResourceId;
  }): Promise<{ id: number }> {
    return this.db.personalAssignment.delete({
      where: this.getWhereObject(id),
      select: { id: true },
    });
  }

  private getWhereObject(id: {
    assignmentId: number;
    resourceId?: PersonalAssignmentResourceId;
  }):
    | { id: number }
    | {
        id: number;
        user: { id: number };
      } {
    if (id.resourceId) {
      return { id: id.assignmentId, user: { id: id.resourceId.userId } };
    }

    return { id: id.assignmentId };
  }
}
