import { inject, injectable } from "inversify";
import {
  CourseClassAssignmentDITypes,
  CourseClassAssignmentModel,
  CourseClassAssignmentResourceId,
  CreateCourseClassAssignmentDto,
  ICourseClassAssignmentRepository,
  ICourseClassAssignmentService,
  UpdateCourseClassAssignmentDto,
} from "../assignment.type";
import { CourseClassModel } from "../../class/class.type";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import { CourseModel } from "../../course/course.type";
import {
  IRepository,
  RepositoryDITypes,
} from "../../../common/class/repository/repository.type";

@injectable()
export default class CourseClassAssignmentService
  implements ICourseClassAssignmentService
{
  @inject(RepositoryDITypes.FACADE)
  private readonly globalRepository: IRepository;

  @inject(CourseClassAssignmentDITypes.REPOSITORY)
  private readonly repository: ICourseClassAssignmentRepository;

  public async createAssignment(
    resourceId: CourseClassAssignmentResourceId,
    dto: CreateCourseClassAssignmentDto,
  ): Promise<CourseClassAssignmentModel> {
    try {
      return await this.repository.createAssignment(resourceId, dto);
    } catch (error: any) {
      throw handleRepositoryError(error, {
        foreignConstraint: {
          default: { message: "Class doesn't exist!" },
        },
      });
    }
  }

  public async getAssignmentById(
    assignmentId: number,
    resourceId: CourseClassAssignmentResourceId,
  ): Promise<CourseClassAssignmentModel> {
    const { assignment } = await this.validateRelationBetweenResources({
      assignmentId,
      resourceId,
    });

    return assignment;
  }

  public async getAssignments(
    resourceId: CourseClassAssignmentResourceId,
  ): Promise<CourseClassAssignmentModel[]> {
    await this.validateRelationBetweenResources({ resourceId });

    return await this.repository.getAssignments(resourceId);
  }

  public async updateAssignment(
    assignmentId: number,
    resourceId: CourseClassAssignmentResourceId,
    dto: UpdateCourseClassAssignmentDto,
  ): Promise<CourseClassAssignmentModel> {
    await this.validateRelationBetweenResources({ assignmentId, resourceId });

    return await this.repository.updateAssignment(
      assignmentId,
      resourceId,
      dto,
    );
  }

  public async deleteAssignment(
    assignmentId: number,
    resourceId: CourseClassAssignmentResourceId,
  ): Promise<{}> {
    await this.validateRelationBetweenResources({ assignmentId, resourceId });

    await this.repository.deleteAssignment(assignmentId, resourceId);

    return {};
  }

  private async validateRelationBetweenResources(id: {
    resourceId: CourseClassAssignmentResourceId;
  }): Promise<{
    course: CourseModel;
    class: CourseClassModel;
  }>;
  private async validateRelationBetweenResources(id: {
    assignmentId: number;
    resourceId: CourseClassAssignmentResourceId;
  }): Promise<{
    course: CourseModel;
    class: CourseClassModel;
    assignment: CourseClassAssignmentModel;
  }>;
  private async validateRelationBetweenResources<
    T1 extends {
      resourceId: CourseClassAssignmentResourceId;
    },
    T2 extends {
      assignmentId: number;
      resourceId: CourseClassAssignmentResourceId;
    },
  >(
    id: T1 | T2,
  ): Promise<
    | {
        class: CourseClassModel;
      }
    | {
        class: CourseClassModel;
        assignment: CourseClassAssignmentModel;
      }
  > {
    const { resourceId } = id;
    const { courseId, classId } = resourceId;

    const theClass = await this.globalRepository.courseClass.getClassById(
      classId,
      resourceId,
    );

    if (!theClass || theClass.courseId !== courseId) {
      throw new RecordNotFoundException("class doesn't exist!");
    }

    if ((id as T2).assignmentId) {
      const { assignmentId } = id as T2;
      const assignment =
        await this.globalRepository.courseClassAssignment.getAssignmentById(
          assignmentId,
          resourceId,
        );

      if (!assignment || assignment.classId !== classId) {
        throw new RecordNotFoundException("assignment doesn't exist!");
      }

      if (assignmentId) {
        return {
          class: theClass,
          assignment,
        };
      }
    }

    return { class: theClass };
  }
}
