import "reflect-metadata";
import {
  CourseEnrollmentModel,
  CourseEnrollmentResourceId,
} from "../enrollment.type";
import { injectable } from "inversify";
import { ICourseEnrollmentRepository } from "../enrollment.interface";
import BaseRepository from "../../../common/class/BaseRepository";
import { $CourseEnrollmentAPI } from "../enrollment.api";

@injectable()
export default class CourseEnrollmentRepository
  extends BaseRepository
  implements ICourseEnrollmentRepository
{
  constructor() {
    super();
  }

  public async createEnrollment(
    id: CourseEnrollmentResourceId["params"],
    data: $CourseEnrollmentAPI.CreateEnrollment.Dto,
  ): Promise<CourseEnrollmentModel> {
    const { courseId } = id;

    return this.db.courseEnrollment.create({
      data: {
        ...data,
        courseId,
      },
    });
  }

  public async getEnrollmentById(
    id: number,
  ): Promise<CourseEnrollmentModel | null> {
    return this.db.courseEnrollment.findUnique({
      where: { id },
    });
  }

  public async getEnrollmentByUserIdAndCourseId(id: {
    userId: number;
    courseId: number;
  }): Promise<CourseEnrollmentModel | null> {
    return this.db.courseEnrollment.findUnique({
      where: {
        userId_courseId: id,
      },
    });
  }

  public async updateEnrollment(
    id: {
      enrollmentId: number;
      resourceId?: CourseEnrollmentResourceId["params"];
    },
    data: Partial<CourseEnrollmentModel>,
  ): Promise<CourseEnrollmentModel> {
    return this.db.courseEnrollment.update({
      where: this.getWhereObjectForSecondLevelOperation(id),
      data,
    });
  }

  public async deleteEnrollment(id: {
    enrollmentId: number;
    resourceId?: CourseEnrollmentResourceId["params"];
  }): Promise<{ id: number }> {
    return this.db.courseEnrollment.delete({
      where: this.getWhereObjectForSecondLevelOperation(id),
      select: { id: true },
    });
  }

  private getWhereObjectForSecondLevelOperation(id: {
    enrollmentId: number;
    resourceId?: CourseEnrollmentResourceId["params"];
  }): { id: number } | { id: number; course: { id: number } } {
    const { enrollmentId, resourceId } = id;

    return resourceId
      ? { id: enrollmentId, course: { id: resourceId.courseId } }
      : { id: enrollmentId };
  }
}
