import { CourseLessonVideo, PrismaClient, Role } from "@prisma/client";
import { injectable } from "inversify";
import {
  CreateCourseLessonVideoDto,
  CourseLessonVideoParams,
  UpdateCourseLessonVideoDto,
} from "../video.type";
import { v4 as uuidv4 } from "uuid";
import dIContainer from "../../../inversifyConfig";
import { databaseDITypes } from "../../../common/constants/databaseDITypes";

export interface ICourseLessonVideoRepository {
  updateVideo: (
    params: CourseLessonVideoParams,
    videoDetails: UpdateCourseLessonVideoDto
  ) => Promise<CourseLessonVideo>;
  deleteVideo: (params: CourseLessonVideoParams) => Promise<CourseLessonVideo>;
  createVideo: (
    params: CourseLessonVideoParams,
    videoDetails: CreateCourseLessonVideoDto
  ) => Promise<CourseLessonVideo>;
}

@injectable()
export class CourseLessonVideoRepository
  implements ICourseLessonVideoRepository
{
  private readonly prisma = dIContainer.get<PrismaClient>(
    databaseDITypes.PRISMA_CLIENT
  );
  private readonly courseLessonVideoTable = this.prisma.courseLessonVideo;

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
      return await this.prisma.$transaction(async (tx) => {
        const deletedVideo = await this.courseLessonVideoTable.delete({
          where: {
            id: params.lessonId,
          },
        });

        await tx.course.update({
          where: {
            id: params.courseId,
          },
          data: {
            totalDurations: { decrement: deletedVideo.totalDurations },
          },
        });

        await tx.courseLesson.update({
          where: {
            id: params.courseId,
          },
          data: {
            totalDurations: { decrement: deletedVideo.totalDurations },
          },
        });

        return deletedVideo;
      });
    } catch (error) {
      throw error;
    }
  }

  public async createVideo(
    params: CourseLessonVideoParams,
    videoDetails: CreateCourseLessonVideoDto
  ): Promise<CourseLessonVideo> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const video = await tx.courseLessonVideo.create({
          data: {
            id: uuidv4(),
            ...videoDetails,
            courseLessonId: params.lessonId,
          },
        });

        await tx.course.update({
          where: {
            id: params.courseId,
          },
          data: {
            totalDurations: { increment: video.totalDurations },
          },
        });

        await tx.courseLesson.update({
          where: {
            id: params.lessonId,
          },
          data: {
            totalDurations: { increment: video.totalDurations },
          },
        });

        return video;
      });
    } catch (error) {
      throw error;
    }
  }
}
