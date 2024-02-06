import "reflect-metadata";
import { ICourseLessonVideoController } from "./video.controller";
import {
  CourseLessonVideoDITypes,
  CreateCourseLessonVideoDto,
  UpdateCourseLessonVideoSourceDto,
} from "../video.type";
import {
  CourseLessonVideoService,
  ICourseLessonVideoService,
} from "../service/video.service";
import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../../../common/constants/statusCode";
import dIContainer from "../../../inversifyConfig";
import errorMiddleware from "../../../middlewares/errorMiddleware";

const mockCreateVideoService = jest.fn();
const mockGetVideoByIdService = jest.fn();
const mockUpdateVideoSourceService = jest.fn();
const mockDeleteVideoService = jest.fn();

/**
 *
 * @param mockRequest
 * @param mockResponse
 * @param next
 *
 * Mock next() function, so it can simulate real world scenario.
 */
function mockNextError(
  mockRequest: Request,
  mockResponse: Response,
  mockNext: NextFunction,
): void {
  (mockNext as jest.Mock).mockImplementation((error: Error) => {
    errorMiddleware(error, mockRequest, mockResponse, mockNext);
  });
}

const someRandomObject = {
  newVideo: "someRandomNewVideo",
};

describe("CourseLessonVideoController Test Suite", () => {
  let sut: ICourseLessonVideoController;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeAll(() => {
    /**
     * Unbind the service container and bind it to the mocked version of the service!
     *
     */
    dIContainer.unbind(CourseLessonVideoDITypes.SERVICE);
    dIContainer
      .bind<ICourseLessonVideoService>(CourseLessonVideoDITypes.SERVICE)
      .toConstantValue({
        createVideo: mockCreateVideoService,
        updateVideoSource: mockUpdateVideoSourceService,
        deleteVideo: mockDeleteVideoService,
        getVideoById: mockGetVideoByIdService,
      } as any);
  });

  afterAll(() => {
    /**
     * Rebind to the real service
     *
     */
    dIContainer.unbind(CourseLessonVideoDITypes.SERVICE);
    dIContainer
      .bind<ICourseLessonVideoService>(CourseLessonVideoDITypes.SERVICE)
      .to(CourseLessonVideoService);
  });

  beforeEach(() => {
    sut = dIContainer.get<ICourseLessonVideoController>(
      CourseLessonVideoDITypes.CONTROLLER,
    );

    mockRequest = {} as Request;
    mockResponse = {
      status: jest.fn(() => mockResponse),
      json: jest.fn(),
    } as any as Response;
    mockNext = jest.fn() as NextFunction;

    mockNextError(mockRequest, mockResponse, mockNext);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("CreateVideo Test", () => {
    type TestCase = {
      name: string;
      user: { id: number } | undefined;
      body: Partial<CreateCourseLessonVideoDto>;
      params: Partial<{ courseId: string; lessonId: string }>;
      runExpect: Function;
    };
    it.each([
      {
        name: "OK: should create a video",
        user: { id: 1 },
        body: {
          name: "someName",
          youtubeLink: "someLink",
          totalDurations: 1,
        },
        params: {
          courseId: "1",
          lessonId: "1",
        },
        runExpect: () => {
          expect(mockCreateVideoService).toHaveBeenCalledTimes(1);
          expect(mockNext).toBeCalledTimes(0);
          expect(mockResponse.status).toBeCalledTimes(1);
          expect(mockResponse.status).toBeCalledWith(
            StatusCode.RESOURCE_CREATED,
          );
          expect(mockResponse.json).toBeCalledTimes(1);
          expect(mockResponse.json).toBeCalledWith({
            data: someRandomObject,
          });
        },
      },
      {
        name: "BadRequest: missing name in dto",
        user: { id: 1 },
        body: {
          youtubeLink: "someLink",
          totalDurations: 1,
        },
        params: {
          courseId: "1",
          lessonId: "1",
        },
        runExpect: () => {
          expect(mockCreateVideoService).toHaveBeenCalledTimes(0);
          expect(mockNext).toBeCalledTimes(1);
          expect(mockNext).toBeCalledWith(expect.any(Error));
          expect(mockResponse.status).toBeCalledTimes(1);
          expect(mockResponse.status).toBeCalledWith(StatusCode.BAD_REQUEST);
          expect(mockResponse.json).toBeCalledTimes(1);
          expect(mockResponse.json).toBeCalledWith({
            error: {
              errorCode: expect.any(String),
              message: expect.any(String) || expect.any(Array<String>),
            },
          });
        },
      },
      {
        name: "BadRequest: missing youtubeLink in dto",
        user: { id: 1 },
        body: {
          name: "someName",
          totalDurations: 1,
        },
        params: {
          courseId: "1",
          lessonId: "1",
        },
        runExpect: () => {
          expect(mockCreateVideoService).toHaveBeenCalledTimes(0);
          expect(mockNext).toBeCalledTimes(1);
          expect(mockNext).toBeCalledWith(expect.any(Error));
          expect(mockResponse.status).toBeCalledTimes(1);
          expect(mockResponse.status).toBeCalledWith(StatusCode.BAD_REQUEST);
          expect(mockResponse.json).toBeCalledTimes(1);
          expect(mockResponse.json).toBeCalledWith({
            error: {
              errorCode: expect.any(String),
              message: expect.any(String) || expect.any(Array<String>),
            },
          });
        },
      },
      {
        name: "BadRequest: missing totalDurations in dto",
        user: { id: 1 },
        body: {
          name: "someName",
          youtubeLink: "someLink",
        },
        params: {
          courseId: "1",
          lessonId: "1",
        },
        runExpect: () => {
          expect(mockCreateVideoService).toHaveBeenCalledTimes(0);
          expect(mockNext).toBeCalledTimes(1);
          expect(mockNext).toBeCalledWith(expect.any(Error));
          expect(mockResponse.status).toBeCalledTimes(1);
          expect(mockResponse.status).toBeCalledWith(StatusCode.BAD_REQUEST);
          expect(mockResponse.json).toBeCalledTimes(1);
          expect(mockResponse.json).toBeCalledWith({
            error: {
              errorCode: expect.any(String),
              message: expect.any(String) || expect.any(Array<String>),
            },
          });
        },
      },
    ] satisfies TestCase[])(
      "$name",
      async ({ user, body, params, runExpect }: TestCase) => {
        (mockRequest as any).user = user;
        mockRequest.body = body;
        mockRequest.params = params;

        mockCreateVideoService.mockReturnValueOnce(someRandomObject);
        const actual = await sut.createVideo(
          mockRequest,
          mockResponse,
          mockNext,
        );

        runExpect();
      },
    );
  });

  describe("UpdateVideo Test", () => {
    const userId = 1;
    const courseId = "1";
    const lessonId = "1";
    const videoId = "1";

    type TestCase = {
      name: string;
      user:
        | {
            id: number;
          }
        | undefined;
      body: Partial<UpdateCourseLessonVideoSourceDto>;
      params: Partial<{ courseId: string; lessonId: string; videoId: string }>;
      runExpect: Function;
    };

    it.each([
      {
        name: "OK: all required dto fields are provided, should update a video",
        user: { id: userId },
        body: {
          youtubeLink: "someYoutubeLink",
          totalDurations: 1,
        },
        params: {
          courseId,
          lessonId,
          videoId,
        },
        runExpect: () => {
          expect(mockUpdateVideoSourceService).toHaveBeenCalledTimes(1);
          expect(mockNext).toBeCalledTimes(0);
          expect(mockResponse.status).toBeCalledTimes(1);
          expect(mockResponse.status).toBeCalledWith(StatusCode.SUCCESS);
          expect(mockResponse.json).toBeCalledTimes(1);
          expect(mockResponse.json).toBeCalledWith({
            data: someRandomObject,
          });
        },
      },
    ] satisfies TestCase[])(
      "$name",
      async ({ name, user, body, params, runExpect }: TestCase) => {
        (mockRequest as any).user = user;
        mockRequest.body = body;
        mockRequest.params = params;

        mockUpdateVideoSourceService.mockReturnValueOnce(someRandomObject);
        const actual = await sut.updateVideoSource(
          mockRequest,
          mockResponse,
          mockNext,
        );

        runExpect();
      },
    );
  });

  describe("GetVideoById Test", () => {
    const userId = 1;
    const courseId = "1";
    const lessonId = "1";
    const videoId = "1";

    type TestCase = {
      name: string;
      user:
        | {
            id: number;
          }
        | undefined;
      params: Partial<{ courseId: string; lessonId: string; videoId: string }>;
      runExpect: Function;
    };

    it.each([
      {
        name: "OK: should get a video by id",
        user: { id: userId },

        params: {
          courseId,
          lessonId,
          videoId,
        },
        runExpect: () => {
          expect(mockGetVideoByIdService).toHaveBeenCalledTimes(1);
          expect(mockNext).toBeCalledTimes(0);
          expect(mockResponse.status).toBeCalledTimes(1);
          expect(mockResponse.status).toBeCalledWith(StatusCode.SUCCESS);
          expect(mockResponse.json).toBeCalledTimes(1);
          expect(mockResponse.json).toBeCalledWith({
            data: someRandomObject,
          });
        },
      },
    ] satisfies TestCase[])(
      "$name",
      async ({ name, user, params, runExpect }: TestCase) => {
        (mockRequest as any).user = user;
        mockRequest.params = params;

        mockGetVideoByIdService.mockReturnValueOnce(someRandomObject);
        const actual = await sut.getVideoById(
          mockRequest,
          mockResponse,
          mockNext,
        );

        runExpect();
      },
    );
  });

  describe("DeleteVideo Test", () => {
    const userId = 1;
    const courseId = "1";
    const lessonId = "1";
    const videoId = "1";

    type TestCase = {
      name: string;
      user:
        | {
            id: number;
          }
        | undefined;
      params: Partial<{ courseId: string; lessonId: string; videoId: string }>;
      runExpect: Function;
    };

    it.each([
      {
        name: "OK: should delete a video",
        user: { id: userId },
        params: {
          courseId,
          lessonId,
          videoId,
        },
        runExpect: () => {
          expect(mockDeleteVideoService).toHaveBeenCalledTimes(1);
          expect(mockNext).toBeCalledTimes(0);
          expect(mockResponse.status).toBeCalledTimes(1);
          expect(mockResponse.status).toBeCalledWith(StatusCode.SUCCESS);
          expect(mockResponse.json).toBeCalledTimes(1);
          expect(mockResponse.json).toBeCalledWith({
            data: {},
          });
        },
      },
    ] satisfies TestCase[])(
      "$name",
      async ({ name, user, params, runExpect }: TestCase) => {
        (mockRequest as any).user = user;
        mockRequest.params = params;

        mockDeleteVideoService.mockReturnValueOnce({});
        const actual = await sut.deleteVideo(
          mockRequest,
          mockResponse,
          mockNext,
        );

        runExpect();
      },
    );
  });
});
