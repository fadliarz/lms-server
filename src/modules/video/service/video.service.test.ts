// import dIContainer from "../../../inversifyConfig";
// import { CourseLessonVideoDITypes } from "../video.type";
// import {
//   CourseLessonVideoService,
//   ICourseLessonVideoService,
// } from "./video.service";
// import { ICourseLessonVideoRepository } from "../repository/video.repository";
//
// enum Fail {
//   SHOULD_THROW_AN_ERROR = "Should throw an error!",
//   SHOULD_NOT_THROW_AN_ERROR = "Should not throw an error!",
// }
//
// const mockCreateVideo = jest.fn();
// const mockGetVideoById = jest.fn();
// const mockGetVideoByIdOrThrow = jest.fn();
// const mockUpdateVideoSource = jest.fn();
// const mockDeleteVideo = jest.fn();
//
// describe("CourseLessonVideoService Test Suites", () => {
//   let sut: ICourseLessonVideoService;
//
//   beforeAll(() => {
//     dIContainer.unbind(CourseLessonVideoDITypes.REPOSITORY);
//     dIContainer
//       .bind<ICourseLessonVideoRepository>(CourseLessonVideoDITypes.REPOSITORY)
//       .toConstantValue({
//         createVideo: mockCreateVideo,
//         getVideoById: mockGetVideoById,
//         getVideoByIdOrThrow: mockGetVideoByIdOrThrow,
//         updateVideoSource: mockUpdateVideoSource,
//         deleteVideo: mockDeleteVideo,
//       });
//   });
//
//   afterAll(() => {
//     dIContainer.unbind(CourseLessonVideoDITypes.REPOSITORY);
//     dIContainer
//       .bind<ICourseLessonVideoService>(CourseLessonVideoDITypes.REPOSITORY)
//       .to(CourseLessonVideoService);
//   });
//
//   beforeEach(() => {
//     sut = dIContainer.get<ICourseLessonVideoService>(
//       CourseLessonVideoDITypes.SERVICE,
//     );
//   });
//
//   afterEach(() => {
//     jest.clearAllMocks();
//   });
//
//   describe("createVideo", () => {
//     it("", async () => {
//       /**
//        * Arrange
//        *
//        */
//
//       const createdVideo = {};
//       mockCreateVideo.mockReturnValueOnce(createdVideo);
//
//       /**
//        * Act
//        *
//        */
//       const actual = await sut.createVideo(undefined as any, undefined as any);
//
//       /**
//        * Assert
//        *
//        */
//       expect(mockCreateLesson).toBeCalledTimes(1);
//       expect(createdLesson).toEqual(actual);
//     });
//   });
// });
