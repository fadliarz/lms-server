import "reflect-metadata";
import { ICourseLessonVideoRepository } from "./video.repository";
import dIContainer from "../../../inversifyConfig";
import {
  CourseLessonVideoDITypes,
  CourseLessonVideoResourceId,
  CreateCourseLessonVideoDto,
  ICourseLessonVideoAuthorization,
  UpdateCourseLessonVideoSourceDto,
} from "../video.type";
import CourseLessonVideoAuthorization from "../authorization/video.authorization";
import {
  IRepository,
  RepositoryDITypes,
} from "../../../common/class/repository/repository.type";
import {
  IRandDTO,
  RandDTODITypes,
} from "../../../common/class/rand_dto/rand_dto.type";
import { UserRoleModel } from "../../course/course.type";
import { CourseLessonResourceId } from "../../lesson/lesson.type";
import ClientException from "../../../common/class/exceptions/ClientException";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";

enum Fail {
  SHOULD_NOT_THROW_AN_ERROR = "Shouldn't throw an error",
  SHOULD_THROW_AN_ERROR = "Should throw an error",
}

/**
 * Authorization mock function
 *
 */
const mockAuthorizeCreateVideo = jest.fn();
const mockAuthorizeGetVideo = jest.fn();
const mockAuthorizeUpdateVideoSource = jest.fn();
const mockAuthorizeDeleteVideo = jest.fn();

describe("CourseLessonVideoRepository Test Suite", () => {
  let sut: ICourseLessonVideoRepository;
  let repository: IRepository;
  let randDTO: IRandDTO;

  beforeAll(() => {
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
    repository = dIContainer.get<IRepository>(RepositoryDITypes.FACADE);
    randDTO = dIContainer.get<IRandDTO>(RandDTODITypes.FACADE);
  });

  afterAll(() => {
    dIContainer.unbind(CourseLessonVideoDITypes.AUTHORIZATION);
    dIContainer
      .bind<ICourseLessonVideoAuthorization>(
        CourseLessonVideoDITypes.AUTHORIZATION,
      )
      .to(CourseLessonVideoAuthorization);
  });

  beforeEach(() => {
    sut = dIContainer.get<ICourseLessonVideoRepository>(
      CourseLessonVideoDITypes.REPOSITORY,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("CourseLessonVideoRepository Test Suite", () => {
    describe("createVideo", () => {
      it("should create a video", async () => {
        const author = await repository.user.createUser(
          randDTO.user.generateCreateUserDTO(),
          "",
          [],
        );
        await repository.user.updateUser(author.id, {
          role: UserRoleModel.INSTRUCTOR,
        });
        const category = await repository.courseCategory.createCategory(
          { userId: author.id },
          { title: "someTitle" },
        );
        const course = await repository.course.createCourse(
          {
            userId: author.id,
          },
          randDTO.course.generateCreateCourseDTO(category.id),
        );
        const courseLessonResourceId: CourseLessonResourceId = {
          userId: author.id,
          courseId: course.id,
        };
        const lesson = await repository.courseLesson.createLesson(
          courseLessonResourceId,
          randDTO.courseLesson.generateCreateLessonDTO(),
        );
        const courseLessonVideoResourceId: CourseLessonVideoResourceId = {
          ...courseLessonResourceId,
          lessonId: lesson.id,
        };

        expect(course.totalVideos).toEqual(0);
        expect(course.totalDurations).toEqual(0);

        expect(lesson.totalVideos).toEqual(0);
        expect(lesson.totalDurations).toEqual(0);

        const dto: CreateCourseLessonVideoDto =
          randDTO.courseLessonVideo.generateCreateLessonVideoDTO();
        const actual = await sut.createVideo(courseLessonVideoResourceId, dto);

        expect(actual).toBeDefined();
        expect(actual.totalDurations).toEqual(dto.totalDurations);

        const updatedCourse = await repository.course.getCourseByIdOrThrow(
          course.id,
          courseLessonResourceId,
          {},
        );
        expect(updatedCourse.totalVideos).toEqual(1);
        expect(updatedCourse.totalDurations).toEqual(dto.totalDurations);

        const updatedLesson =
          await repository.courseLesson.getLessonByIdOrThrow(
            lesson.id,
            courseLessonResourceId,
          );
        expect(updatedLesson.totalVideos).toEqual(1);
        expect(updatedLesson.totalDurations).toEqual(dto.totalDurations);
      });
    });

    describe("getVideoById", () => {
      it("video exists: should get a video", async () => {
        const author = await repository.user.createUser(
          randDTO.user.generateCreateUserDTO(),
          "",
          [],
        );
        await repository.user.updateUser(author.id, {
          role: UserRoleModel.INSTRUCTOR,
        });
        const category = await repository.courseCategory.createCategory(
          { userId: author.id },
          { title: "someTitle" },
        );
        const course = await repository.course.createCourse(
          {
            userId: author.id,
          },
          randDTO.course.generateCreateCourseDTO(category.id),
        );
        const courseLessonResourceId: CourseLessonResourceId = {
          userId: author.id,
          courseId: course.id,
        };
        const lesson = await repository.courseLesson.createLesson(
          courseLessonResourceId,
          randDTO.courseLesson.generateCreateLessonDTO(),
        );
        const courseLessonVideoResourceId: CourseLessonVideoResourceId = {
          ...courseLessonResourceId,
          lessonId: lesson.id,
        };

        const video = await repository.courseLessonVideo.createVideo(
          courseLessonVideoResourceId,
          randDTO.courseLessonVideo.generateCreateLessonVideoDTO(),
        );
        const expected = video;

        expect(course.totalVideos).toEqual(0);
        expect(course.totalDurations).toEqual(0);

        expect(lesson.totalVideos).toEqual(0);
        expect(lesson.totalDurations).toEqual(0);

        expect(video.totalDurations).toEqual(expect.any(Number));

        const actual = await sut.getVideoById(
          video.id,
          courseLessonVideoResourceId,
        );
        expect(actual).not.toBeNull();
        expect(actual).toBeDefined();

        const updatedCourse = await repository.course.getCourseByIdOrThrow(
          course.id,
          courseLessonResourceId,
          {},
        );
        expect(updatedCourse.totalVideos).toEqual(1);
        expect(updatedCourse.totalDurations).toEqual(video.totalDurations);

        const updatedLesson =
          await repository.courseLesson.getLessonByIdOrThrow(
            lesson.id,
            courseLessonResourceId,
          );
        expect(updatedLesson.totalVideos).toEqual(1);
        expect(updatedLesson.totalDurations).toEqual(video.totalDurations);
      });
    });

    describe("getVideoByIdOrThrow", () => {
      it("video exists: should get a video", async () => {
        const author = await repository.user.createUser(
          randDTO.user.generateCreateUserDTO(),
          "",
          [],
        );
        await repository.user.updateUser(author.id, {
          role: UserRoleModel.INSTRUCTOR,
        });
        const category = await repository.courseCategory.createCategory(
          { userId: author.id },
          { title: "someTitle" },
        );
        const course = await repository.course.createCourse(
          {
            userId: author.id,
          },
          randDTO.course.generateCreateCourseDTO(category.id),
        );
        const courseLessonResourceId: CourseLessonResourceId = {
          userId: author.id,
          courseId: course.id,
        };
        const lesson = await repository.courseLesson.createLesson(
          courseLessonResourceId,
          randDTO.courseLesson.generateCreateLessonDTO(),
        );
        const courseLessonVideoResourceId: CourseLessonVideoResourceId = {
          ...courseLessonResourceId,
          lessonId: lesson.id,
        };

        const video = await repository.courseLessonVideo.createVideo(
          courseLessonVideoResourceId,
          randDTO.courseLessonVideo.generateCreateLessonVideoDTO(),
        );
        const expected = video;

        expect(course.totalVideos).toEqual(0);
        expect(course.totalDurations).toEqual(0);

        expect(lesson.totalVideos).toEqual(0);
        expect(lesson.totalDurations).toEqual(0);

        expect(video.totalDurations).toEqual(expect.any(Number));

        const actual = await sut.getVideoByIdOrThrow(
          video.id,
          courseLessonVideoResourceId,
        );
        expect(actual).not.toBeNull();
        expect(actual).toBeDefined();

        const updatedCourse = await repository.course.getCourseByIdOrThrow(
          course.id,
          courseLessonResourceId,
          {},
        );
        expect(updatedCourse.totalVideos).toEqual(1);
        expect(updatedCourse.totalDurations).toEqual(video.totalDurations);

        const updatedLesson =
          await repository.courseLesson.getLessonByIdOrThrow(
            lesson.id,
            courseLessonResourceId,
          );
        expect(updatedLesson.totalVideos).toEqual(1);
        expect(updatedLesson.totalDurations).toEqual(video.totalDurations);
      });

      type GetLessonByIdOrThrowArgs = {
        exception?: Error;
      };
      it.each([{ exception: new ClientException() }, {}])(
        "",
        async ({ exception }: GetLessonByIdOrThrowArgs) => {
          const author = await repository.user.createUser(
            randDTO.user.generateCreateUserDTO(),
            "",
            [],
          );
          await repository.user.updateUser(author.id, {
            role: UserRoleModel.INSTRUCTOR,
          });
          const category = await repository.courseCategory.createCategory(
            { userId: author.id },
            { title: "someTitle" },
          );
          const course = await repository.course.createCourse(
            {
              userId: author.id,
            },
            randDTO.course.generateCreateCourseDTO(category.id),
          );
          const courseLessonResourceId: CourseLessonResourceId = {
            userId: author.id,
            courseId: course.id,
          };
          const lesson = await repository.courseLesson.createLesson(
            courseLessonResourceId,
            randDTO.courseLesson.generateCreateLessonDTO(),
          );
          const courseLessonVideoResourceId: CourseLessonVideoResourceId = {
            ...courseLessonResourceId,
            lessonId: lesson.id,
          };

          const video = await repository.courseLessonVideo.createVideo(
            courseLessonVideoResourceId,
            randDTO.courseLessonVideo.generateCreateLessonVideoDTO(),
          );

          await repository.courseLessonVideo.deleteVideo(
            video.id,
            courseLessonVideoResourceId,
          );

          const deletedVideo = await repository.courseLessonVideo.getVideoById(
            video.id,
            courseLessonVideoResourceId,
          );
          expect(deletedVideo).toBeNull();

          try {
            const actual = await sut.getVideoByIdOrThrow(
              video.id,
              courseLessonVideoResourceId,
              exception,
            );

            fail(Fail.SHOULD_THROW_AN_ERROR);
          } catch (error) {
            if (exception) {
              expect(error).toEqual(exception);
            }

            if (!exception) {
              expect(error).toEqual(expect.any(RecordNotFoundException));
            }
          }
        },
      );
    });

    describe("updateVideoSource", () => {
      it("video exists: should update a video source", async () => {
        const author = await repository.user.createUser(
          randDTO.user.generateCreateUserDTO(),
          "",
          [],
        );
        await repository.user.updateUser(author.id, {
          role: UserRoleModel.INSTRUCTOR,
        });
        const category = await repository.courseCategory.createCategory(
          { userId: author.id },
          { title: "someTitle" },
        );
        const course = await repository.course.createCourse(
          {
            userId: author.id,
          },
          randDTO.course.generateCreateCourseDTO(category.id),
        );
        const courseLessonResourceId: CourseLessonResourceId = {
          userId: author.id,
          courseId: course.id,
        };
        const lesson = await repository.courseLesson.createLesson(
          courseLessonResourceId,
          randDTO.courseLesson.generateCreateLessonDTO(),
        );
        const courseLessonVideoResourceId: CourseLessonVideoResourceId = {
          ...courseLessonResourceId,
          lessonId: lesson.id,
        };

        const video = await repository.courseLessonVideo.createVideo(
          courseLessonVideoResourceId,
          randDTO.courseLessonVideo.generateCreateLessonVideoDTO(),
        );
        const expected = video;

        expect(course.totalVideos).toEqual(0);
        expect(course.totalDurations).toEqual(0);

        expect(lesson.totalVideos).toEqual(0);
        expect(lesson.totalDurations).toEqual(0);

        expect(video.totalDurations).toEqual(expect.any(Number));

        const dto: UpdateCourseLessonVideoSourceDto = {
          youtubeLink: video.youtubeLink + "someModifier",
          totalDurations: video.totalDurations + 10,
        };
        const actual = await sut.updateVideoSource(
          video.id,
          courseLessonVideoResourceId,
          dto,
        );

        expect(actual).not.toEqual(expected);
        expect(actual.updatedAt).not.toEqual(expected.updatedAt);
        expect({
          ...actual,
          updatedAt: undefined,
        }).toEqual({
          ...expected,
          ...dto,
          updatedAt: undefined,
        });

        const updatedCourse = await repository.course.getCourseByIdOrThrow(
          course.id,
          courseLessonResourceId,
          {},
        );
        expect(updatedCourse.totalVideos).toEqual(1);
        expect(updatedCourse.totalDurations).toEqual(dto.totalDurations);

        const updatedLesson =
          await repository.courseLesson.getLessonByIdOrThrow(
            lesson.id,
            courseLessonResourceId,
          );
        expect(updatedLesson.totalVideos).toEqual(1);
        expect(updatedLesson.totalDurations).toEqual(dto.totalDurations);
      });
    });

    describe("deleteVideo", () => {
      it("video exists: should delete a video", async () => {
        const author = await repository.user.createUser(
          randDTO.user.generateCreateUserDTO(),
          "",
          [],
        );
        await repository.user.updateUser(author.id, {
          role: UserRoleModel.INSTRUCTOR,
        });
        const category = await repository.courseCategory.createCategory(
          { userId: author.id },
          { title: "someTitle" },
        );
        const course = await repository.course.createCourse(
          {
            userId: author.id,
          },
          randDTO.course.generateCreateCourseDTO(category.id),
        );
        const courseLessonResourceId: CourseLessonResourceId = {
          userId: author.id,
          courseId: course.id,
        };
        const lesson = await repository.courseLesson.createLesson(
          courseLessonResourceId,
          randDTO.courseLesson.generateCreateLessonDTO(),
        );
        const courseLessonVideoResourceId: CourseLessonVideoResourceId = {
          ...courseLessonResourceId,
          lessonId: lesson.id,
        };

        const video = await repository.courseLessonVideo.createVideo(
          courseLessonVideoResourceId,
          randDTO.courseLessonVideo.generateCreateLessonVideoDTO(),
        );

        expect(course.totalVideos).toEqual(0);
        expect(course.totalDurations).toEqual(0);

        expect(lesson.totalVideos).toEqual(0);
        expect(lesson.totalDurations).toEqual(0);

        expect(video.totalDurations).toEqual(expect.any(Number));

        const actual = await sut.deleteVideo(
          video.id,
          courseLessonVideoResourceId,
        );
        expect(actual).toEqual({});

        expect(
          await repository.courseLessonVideo.getVideoById(
            video.id,
            courseLessonVideoResourceId,
          ),
        ).toBeNull();

        const updatedCourse = await repository.course.getCourseByIdOrThrow(
          course.id,
          courseLessonResourceId,
          {},
        );
        expect(updatedCourse.totalVideos).toEqual(0);
        expect(updatedCourse.totalDurations).toEqual(0);

        const updatedLesson =
          await repository.courseLesson.getLessonByIdOrThrow(
            lesson.id,
            courseLessonResourceId,
          );
        expect(updatedLesson.totalVideos).toEqual(0);
        expect(updatedLesson.totalDurations).toEqual(0);
      });
    });
  });
});
