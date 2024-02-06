import "reflect-metadata";
import { ICourseLessonVideoRepository } from "./video.repository";
import dIContainer from "../../../inversifyConfig";
import {
  CourseLessonVideoDITypes,
  CourseLessonVideoResourceId,
  CreateCourseLessonVideoDto,
  ICourseLessonVideoAuthorization,
} from "../video.type";
import CourseLessonVideoAuthorization from "../authorization/video.authorization";
import RandDB from "../../../common/class/randprisma/rand.type";
import RandPrisma from "../../../common/class/randprisma/RandPrisma";
import { ITable } from "../../../common/class/table/table.type";
import PrismaTable, {
  PrismaTableDITypes,
} from "../../../common/class/table/PrismaTable";

/**
 * Authorization mock function
 *
 */
const mockAuthorizeCreateVideo = jest.fn();
const mockAuthorizeGetVideo = jest.fn();
const mockAuthorizeUpdateVideoSource = jest.fn();
const mockAuthorizeDeleteVideo = jest.fn();

/**
 * Resource Id
 *
 */

describe("CourseLessonVideoRepository Test Suite", () => {
  let sut: ICourseLessonVideoRepository;
  let rand: RandDB;
  let table: ITable;

  beforeAll(() => {
    rand = new RandPrisma();
    table = dIContainer.get<PrismaTable>(PrismaTableDITypes.TABLE);
    dIContainer.unbind(CourseLessonVideoDITypes.AUTHORIZATION);
    dIContainer
      .bind<ICourseLessonVideoAuthorization>(
        CourseLessonVideoDITypes.AUTHORIZATION,
      )
      .toConstantValue({
        authorizeCreateVideo: mockAuthorizeCreateVideo,
        authorizeGetVideo: mockAuthorizeGetVideo,
        authorizeUpdateVideo: mockAuthorizeUpdateVideoSource,
        authorizeDeleteVideo: mockAuthorizeDeleteVideo,
      });
  });

  afterAll(() => {
    dIContainer.unbind(CourseLessonVideoDITypes.AUTHORIZATION);
    dIContainer.bind<ICourseLessonVideoAuthorization>(
      CourseLessonVideoAuthorization,
    );
  });

  beforeEach(() => {
    sut = dIContainer.get<ICourseLessonVideoRepository>(
      CourseLessonVideoDITypes.REPOSITORY,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createVideo test", () => {
    it("should create a video", async () => {
      const { author, lesson, course } = await rand.generateLesson();
      const resourceId: CourseLessonVideoResourceId = {
        userId: author.id,
        courseId: course.id,
        lessonId: lesson.id,
      };

      expect(course.totalVideos).toEqual(0);
      expect(course.totalDurations).toEqual(0);

      expect(lesson.totalVideos).toEqual(0);
      expect(lesson.totalDurations).toEqual(0);

      const dto: CreateCourseLessonVideoDto = {
        name: "someName",
        youtubeLink: "someYoutubeLink",
        totalDurations: 10,
      };
      const actual = await sut.createVideo(resourceId, dto);

      expect(actual).toBeDefined();
      expect(actual.totalDurations).toEqual(dto.totalDurations);

      const updatedCourse = await table.course.findUniqueOrThrow(course.id);
      expect(updatedCourse.totalVideos).toEqual(1);
      expect(updatedCourse.totalDurations).toEqual(dto.totalDurations);

      const updatedLesson = await table.courseLesson.findUniqueOrThrow(
        lesson.id,
      );
      expect(updatedLesson.totalVideos).toEqual(1);
      expect(updatedLesson.totalDurations).toEqual(dto.totalDurations);
    });

    it("should update a video", async () => {
      const { author, course, lesson, video, category } =
        await rand.generateVideo();
      const resourceId: CourseLessonVideoResourceId = {
        userId: author.id,
        courseId: course.id,
        lessonId: lesson.id,
      };

      expect(video.totalDurations).toEqual(expect.any(Number));

      expect(course.totalVideos).toBe(1);
      expect(course.totalDurations).toBe(video.totalDurations);

      expect(lesson.totalVideos).toBe(1);
      expect(lesson.totalDurations).toBe(video.totalDurations);

      const actual = await sut.deleteVideo(video.id, resourceId);

      expect(actual).toEqual({});

      const videoAfterDeletion = await table.courseLessonVideo.findUnique(
        video.id,
      );
      expect(videoAfterDeletion).toBeNull();

      const updatedCourse = await table.course.findUniqueOrThrow(course.id);
      expect(updatedCourse.totalVideos).toEqual(0);
      expect(updatedCourse.totalDurations).toEqual(0);

      const updatedLesson = await table.courseLesson.findUniqueOrThrow(
        lesson.id,
      );
      expect(updatedLesson.totalVideos).toEqual(0);
      expect(updatedLesson.totalDurations).toEqual(0);
    });
  });
});
