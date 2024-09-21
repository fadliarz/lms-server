import "reflect-metadata";
import {
  CourseEnrollmentRoleModel,
  CourseLikeModel,
  CourseLikeResourceId,
  CourseModel,
} from "../course.type";
import { injectable } from "inversify";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import { ICourseRepository } from "../course.interface";
import BaseRepository from "../../../common/class/BaseRepository";
import { $CourseAPI } from "../course.api";
import getQueryExtendsObject from "../../../common/functions/getQueryExtendObject";

@injectable()
export default class CourseRepository
  extends BaseRepository
  implements ICourseRepository
{
  constructor() {
    super();
  }

  public async createCourse(
    data: { authorId: number } & $CourseAPI.CreateCourse.Dto,
  ): Promise<CourseModel> {
    return this.db.course.create({
      data,
    });
  }

  public async getCourses(
    query?: Partial<$CourseAPI.GetCourses.Query>,
  ): Promise<$CourseAPI.GetCourses.Response["data"]> {
    return this.db.course.findMany({
      ...(query?.pageNumber && query.pageSize
        ? {
            take: query.pageSize,
            skip: (query.pageNumber - 1) * query.pageSize,
          }
        : {}),
      include: {
        category: !!query?.include_category,
      },
      ...(query?.category_id && query.category_id.length > 0
        ? { where: { category: { id: { in: query.category_id } } } }
        : {}),
    });
  }

  public async getCourseById(
    id: {
      courseId: number;
    },
    query?: Partial<$CourseAPI.GetCourseById.Query>,
  ): Promise<$CourseAPI.GetCourseById.Response["data"] | null> {
    return this.db.course.findUnique({
      where: { id: id.courseId },
      include: query
        ? {
            category: !!query.include_category,
            lessons: !!query.include_lessons
              ? !!query.include_public_videos
                ? {
                    select: {
                      id: true,
                      title: true,
                      description: true,
                      totalVideos: true,
                      totalAttachments: true,
                      videos: {
                        select: {
                          id: true,
                          name: true,
                          description: true,
                          totalDurations: true,
                        },
                      },
                    },
                  }
                : {
                    select: {
                      id: true,
                      title: true,
                      description: true,
                      totalVideos: true,
                      totalAttachments: true,
                    },
                  }
              : false,
          }
        : undefined,
    });
  }

  public async getCourseByIdOrThrow(
    id: {
      courseId: number;
    },
    query?: $CourseAPI.GetCourseById.Query,
    error?: Error,
  ): Promise<$CourseAPI.GetCourseById.Response["data"]> {
    const course = await this.getCourseById(id, query);

    if (!course) {
      throw error || new RecordNotFoundException();
    }

    return course;
  }

  public async getCourseInstructors(
    id: {
      courseId: number;
    },
    query?: $CourseAPI.GetCourseInstructors.Query,
  ): Promise<$CourseAPI.GetCourseInstructors.Response["data"]> {
    const enrollments = await this.db.courseEnrollment.findMany({
      where: {
        courseId: id.courseId,
        role: CourseEnrollmentRoleModel.INSTRUCTOR,
      },
      select: {
        user: {
          select: {
            id: true,
            NIM: true,
            name: true,
          },
        },
      },
      ...getQueryExtendsObject(query),
    });

    return enrollments.map((enrollment) => enrollment.user);
  }

  public async updateCourse(
    id: { courseId: number },
    data: Partial<CourseModel>,
  ): Promise<CourseModel> {
    return this.db.course.update({ where: { id: id.courseId }, data });
  }

  public async deleteCourse(id: { courseId: number }): Promise<{ id: number }> {
    return this.db.course.delete({
      where: {
        id: id.courseId,
      },
    });
  }

  public async createLike(
    id: {
      courseId: number;
      resourceId?: Omit<CourseLikeResourceId["params"], "courseId">;
    },
    data: { userId: number } & $CourseAPI.CreateLike.Dto,
  ): Promise<CourseLikeModel> {
    return this.db.courseLike.create({
      data: { ...data, courseId: id.courseId },
    });
  }

  public async getLikeById(id: {
    likeId: number;
    resourceId?: CourseLikeResourceId["params"];
  }): Promise<CourseLikeModel | null> {
    const { likeId, resourceId } = id;

    return this.db.courseLike.findFirst({
      where: resourceId
        ? { id: likeId, courseId: resourceId.courseId }
        : { id: likeId },
    });
  }

  public async getLikeByIdOrThrow(
    id: {
      likeId: number;
      resourceId?: CourseLikeResourceId["params"];
    },
    error?: Error,
  ): Promise<CourseLikeModel> {
    const like = await this.getLikeById(id);

    if (!like) {
      throw error || new RecordNotFoundException();
    }

    return like;
  }

  public async deleteLike(id: {
    likeId: number;
    resourceId?: CourseLikeResourceId["params"];
  }): Promise<{ id: number }> {
    const { likeId, resourceId } = id;

    const where = resourceId
      ? {
          id: likeId,
          courseId: resourceId.courseId,
        }
      : { id: likeId };

    return this.db.courseLike.delete({
      where,
    });
  }
}
