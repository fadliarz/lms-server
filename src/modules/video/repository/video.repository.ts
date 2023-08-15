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
  deleteVideo: (params: CourseLessonVideoParams) => Promise<CourseLessonVideo>;
  updateVideo: (
    params: CourseLessonVideoParams,
    videoDetails: UpdateCourseLessonVideoDto
  ) => Promise<CourseLessonVideo>;
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

  public async deleteVideo(
    params: CourseLessonVideoParams
  ): Promise<CourseLessonVideo> {
    try {
      const deletedVideo = await this.prisma.$transaction(async (tx) => {
        const deletedVideo = await this.courseLessonVideoTable.delete({
          where: {
            id: Number(params.lessonId),
          },
        });

        await Promise.all([
          tx.course.update({
            where: {
              id: Number(params.courseId),
            },
            data: {
              totalVideos: { decrement: 1 },
              totalDurations: { decrement: deletedVideo.totalDurations },
            },
          }),
          tx.courseLesson.update({
            where: {
              id: Number(params.courseId),
            },
            data: {
              totalVideos: { decrement: 1 },
              totalDurations: { decrement: deletedVideo.totalDurations },
            },
          }),
        ]);

        return deletedVideo;
      });

      return deletedVideo;
    } catch (error) {
      throw error;
    }
  }

  public async updateVideo(
    params: CourseLessonVideoParams,
    videoDetails: UpdateCourseLessonVideoDto
  ): Promise<CourseLessonVideo> {
    try {
      const updatedVideo = await this.courseLessonVideoTable.update({
        where: {
          id: Number(params.lessonId),
        },
        data: videoDetails,
      });

      return updatedVideo;
    } catch (error) {
      throw error;
    }
  }

  public async createVideo(
    params: CourseLessonVideoParams,
    videoDetails: CreateCourseLessonVideoDto
  ): Promise<CourseLessonVideo> {
    try {
      const video = await this.prisma.$transaction(async (tx) => {
        const [video] = await Promise.all([
          tx.courseLessonVideo.create({
            data: {
              lessonId: Number(params.lessonId),
              ...videoDetails,
            },
          }),
          tx.course.update({
            where: {
              id: Number(params.courseId),
            },
            data: {
              totalDurations: { increment: videoDetails.totalDurations },
              totalVideos: { increment: 1 },
            },
          }),
          tx.courseLesson.update({
            where: {
              id: Number(params.lessonId),
            },
            data: {
              totalDurations: { increment: videoDetails.totalDurations },
              totalVideos: { increment: 1 },
            },
          }),
        ]);

        return video;
      });

      return video;
    } catch (error) {
      throw error;
    }
  }
}
