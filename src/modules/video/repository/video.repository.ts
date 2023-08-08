import { CourseLessonVideo, PrismaClient, Role } from "@prisma/client";
import { injectable } from "inversify";
import {
  CreateCourseLessonVideoDto,
  CourseLessonVideoParams,
  UpdateCourseLessonVideoDto,
} from "../video.type";
import { v4 as uuidv4 } from "uuid";

export interface ICourseLessonVideoRepository {
  updateVideo: (
    params: CourseLessonVideoParams,
    videoDetails: UpdateCourseLessonVideoDto
  ) => Promise<CourseLessonVideo>;
  deleteVideo: (params: CourseLessonVideoParams) => Promise<CourseLessonVideo>;
  isOwnerOfCourse: (userId: string, courseId: string) => Promise<boolean>;
  getUserEnrollmentRoleInCourse: (
    userId: string,
    courseId: string
  ) => Promise<Role>;
  createVideo: (
    params: CourseLessonVideoParams,
    videoDetails: CreateCourseLessonVideoDto
  ) => Promise<CourseLessonVideo>;
}

@injectable()
export class CourseLessonVideoRepository
  implements ICourseLessonVideoRepository
{
  private readonly courseLessonVideoTable = new PrismaClient()
    .courseLessonVideo;
  private readonly courseEnrollmentTable = new PrismaClient().courseEnrollment;
  private readonly courseTable = new PrismaClient().course;

  public async updateVideo(
    params: CourseLessonVideoParams,
    videoDetails: UpdateCourseLessonVideoDto
  ): Promise<CourseLessonVideo> {
    try {
      const updatedVideo = await this.courseLessonVideoTable.update({
        where: {
          id: params.lessonId,
        },
        data: videoDetails,
      });

      return updatedVideo;
    } catch (error) {
      throw error;
    }
  }

  public async deleteVideo(
    params: CourseLessonVideoParams
  ): Promise<CourseLessonVideo> {
    try {
      const deletedVideo = await this.courseLessonVideoTable.delete({
        where: {
          id: params.lessonId,
        },
      });

      return deletedVideo;
    } catch (error) {
      throw error;
    }
  }

  public async isOwnerOfCourse(
    userId: string,
    courseId: string
  ): Promise<boolean> {
    try {
      const { authorId } = await this.courseTable.findUniqueOrThrow({
        where: {
          id: courseId,
        },
      });

      return authorId === userId;
    } catch (error) {
      throw error;
    }
  }

  public async getUserEnrollmentRoleInCourse(
    userId: string,
    courseId: string
  ): Promise<Role> {
    try {
      const { role } = await this.courseEnrollmentTable.findUniqueOrThrow({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });

      return role;
    } catch (error) {
      throw error;
    }
  }

  public async createVideo(
    params: CourseLessonVideoParams,
    videoDetails: CreateCourseLessonVideoDto
  ): Promise<CourseLessonVideo> {
    try {
      const video = await this.courseLessonVideoTable.create({
        data: {
          id: uuidv4(),
          ...videoDetails,
          courseLessonId: params.lessonId,
        },
      });

      return video;
    } catch (error) {
      throw error;
    }
  }
}
