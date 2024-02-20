"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const video_type_1 = require("../video.type");
const video_authorization_1 = __importDefault(require("../authorization/video.authorization"));
const repository_type_1 = require("../../../common/class/repository/repository.type");
const rand_dto_type_1 = require("../../../common/class/rand_dto/rand_dto.type");
const course_type_1 = require("../../course/course.type");
const ClientException_1 = __importDefault(require("../../../common/class/exceptions/ClientException"));
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
var Fail;
(function (Fail) {
    Fail["SHOULD_NOT_THROW_AN_ERROR"] = "Shouldn't throw an error";
    Fail["SHOULD_THROW_AN_ERROR"] = "Should throw an error";
})(Fail || (Fail = {}));
/**
 * Authorization mock function
 *
 */
const mockAuthorizeCreateVideo = jest.fn();
const mockAuthorizeGetVideo = jest.fn();
const mockAuthorizeUpdateVideoSource = jest.fn();
const mockAuthorizeDeleteVideo = jest.fn();
describe("CourseLessonVideoRepository Test Suite", () => {
    let sut;
    let repository;
    let randDTO;
    beforeAll(() => {
        inversifyConfig_1.default.unbind(video_type_1.CourseLessonVideoDITypes.AUTHORIZATION);
        inversifyConfig_1.default
            .bind(video_type_1.CourseLessonVideoDITypes.AUTHORIZATION)
            .toConstantValue({
            authorizeCreateVideo: mockAuthorizeCreateVideo,
            authorizeGetVideo: mockAuthorizeGetVideo,
            authorizeUpdateVideo: mockAuthorizeUpdateVideoSource,
            authorizeDeleteVideo: mockAuthorizeDeleteVideo,
        });
        repository = inversifyConfig_1.default.get(repository_type_1.RepositoryDITypes.FACADE);
        randDTO = inversifyConfig_1.default.get(rand_dto_type_1.RandDTODITypes.FACADE);
    });
    afterAll(() => {
        inversifyConfig_1.default.unbind(video_type_1.CourseLessonVideoDITypes.AUTHORIZATION);
        inversifyConfig_1.default
            .bind(video_type_1.CourseLessonVideoDITypes.AUTHORIZATION)
            .to(video_authorization_1.default);
    });
    beforeEach(() => {
        sut = inversifyConfig_1.default.get(video_type_1.CourseLessonVideoDITypes.REPOSITORY);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("CourseLessonVideoRepository Test Suite", () => {
        describe("createVideo", () => {
            it("should create a video", () => __awaiter(void 0, void 0, void 0, function* () {
                const author = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
                yield repository.user.updateUser(author.id, {
                    role: course_type_1.UserRoleModel.INSTRUCTOR,
                });
                const category = yield repository.courseCategory.createCategory({ userId: author.id }, { title: "someTitle" });
                const course = yield repository.course.createCourse({
                    userId: author.id,
                }, randDTO.course.generateCreateCourseDTO(category.id));
                const courseLessonResourceId = {
                    userId: author.id,
                    courseId: course.id,
                };
                const lesson = yield repository.courseLesson.createLesson(courseLessonResourceId, randDTO.courseLesson.generateCreateLessonDTO());
                const courseLessonVideoResourceId = Object.assign(Object.assign({}, courseLessonResourceId), { lessonId: lesson.id });
                expect(course.totalVideos).toEqual(0);
                expect(course.totalDurations).toEqual(0);
                expect(lesson.totalVideos).toEqual(0);
                expect(lesson.totalDurations).toEqual(0);
                const dto = randDTO.courseLessonVideo.generateCreateLessonVideoDTO();
                const actual = yield sut.createVideo(courseLessonVideoResourceId, dto);
                expect(actual).toBeDefined();
                expect(actual.totalDurations).toEqual(dto.totalDurations);
                const updatedCourse = yield repository.course.getCourseByIdOrThrow(course.id, courseLessonResourceId, {});
                expect(updatedCourse.totalVideos).toEqual(1);
                expect(updatedCourse.totalDurations).toEqual(dto.totalDurations);
                const updatedLesson = yield repository.courseLesson.getLessonByIdOrThrow(lesson.id, courseLessonResourceId);
                expect(updatedLesson.totalVideos).toEqual(1);
                expect(updatedLesson.totalDurations).toEqual(dto.totalDurations);
            }));
        });
        describe("getVideoById", () => {
            it("video exists: should get a video", () => __awaiter(void 0, void 0, void 0, function* () {
                const author = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
                yield repository.user.updateUser(author.id, {
                    role: course_type_1.UserRoleModel.INSTRUCTOR,
                });
                const category = yield repository.courseCategory.createCategory({ userId: author.id }, { title: "someTitle" });
                const course = yield repository.course.createCourse({
                    userId: author.id,
                }, randDTO.course.generateCreateCourseDTO(category.id));
                const courseLessonResourceId = {
                    userId: author.id,
                    courseId: course.id,
                };
                const lesson = yield repository.courseLesson.createLesson(courseLessonResourceId, randDTO.courseLesson.generateCreateLessonDTO());
                const courseLessonVideoResourceId = Object.assign(Object.assign({}, courseLessonResourceId), { lessonId: lesson.id });
                const video = yield repository.courseLessonVideo.createVideo(courseLessonVideoResourceId, randDTO.courseLessonVideo.generateCreateLessonVideoDTO());
                const expected = video;
                expect(course.totalVideos).toEqual(0);
                expect(course.totalDurations).toEqual(0);
                expect(lesson.totalVideos).toEqual(0);
                expect(lesson.totalDurations).toEqual(0);
                expect(video.totalDurations).toEqual(expect.any(Number));
                const actual = yield sut.getVideoById(video.id, courseLessonVideoResourceId);
                expect(actual).not.toBeNull();
                expect(actual).toBeDefined();
                const updatedCourse = yield repository.course.getCourseByIdOrThrow(course.id, courseLessonResourceId, {});
                expect(updatedCourse.totalVideos).toEqual(1);
                expect(updatedCourse.totalDurations).toEqual(video.totalDurations);
                const updatedLesson = yield repository.courseLesson.getLessonByIdOrThrow(lesson.id, courseLessonResourceId);
                expect(updatedLesson.totalVideos).toEqual(1);
                expect(updatedLesson.totalDurations).toEqual(video.totalDurations);
            }));
        });
        describe("getVideoByIdOrThrow", () => {
            it("video exists: should get a video", () => __awaiter(void 0, void 0, void 0, function* () {
                const author = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
                yield repository.user.updateUser(author.id, {
                    role: course_type_1.UserRoleModel.INSTRUCTOR,
                });
                const category = yield repository.courseCategory.createCategory({ userId: author.id }, { title: "someTitle" });
                const course = yield repository.course.createCourse({
                    userId: author.id,
                }, randDTO.course.generateCreateCourseDTO(category.id));
                const courseLessonResourceId = {
                    userId: author.id,
                    courseId: course.id,
                };
                const lesson = yield repository.courseLesson.createLesson(courseLessonResourceId, randDTO.courseLesson.generateCreateLessonDTO());
                const courseLessonVideoResourceId = Object.assign(Object.assign({}, courseLessonResourceId), { lessonId: lesson.id });
                const video = yield repository.courseLessonVideo.createVideo(courseLessonVideoResourceId, randDTO.courseLessonVideo.generateCreateLessonVideoDTO());
                const expected = video;
                expect(course.totalVideos).toEqual(0);
                expect(course.totalDurations).toEqual(0);
                expect(lesson.totalVideos).toEqual(0);
                expect(lesson.totalDurations).toEqual(0);
                expect(video.totalDurations).toEqual(expect.any(Number));
                const actual = yield sut.getVideoByIdOrThrow(video.id, courseLessonVideoResourceId);
                expect(actual).not.toBeNull();
                expect(actual).toBeDefined();
                const updatedCourse = yield repository.course.getCourseByIdOrThrow(course.id, courseLessonResourceId, {});
                expect(updatedCourse.totalVideos).toEqual(1);
                expect(updatedCourse.totalDurations).toEqual(video.totalDurations);
                const updatedLesson = yield repository.courseLesson.getLessonByIdOrThrow(lesson.id, courseLessonResourceId);
                expect(updatedLesson.totalVideos).toEqual(1);
                expect(updatedLesson.totalDurations).toEqual(video.totalDurations);
            }));
            it.each([{ exception: new ClientException_1.default() }, {}])("", ({ exception }) => __awaiter(void 0, void 0, void 0, function* () {
                const author = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
                yield repository.user.updateUser(author.id, {
                    role: course_type_1.UserRoleModel.INSTRUCTOR,
                });
                const category = yield repository.courseCategory.createCategory({ userId: author.id }, { title: "someTitle" });
                const course = yield repository.course.createCourse({
                    userId: author.id,
                }, randDTO.course.generateCreateCourseDTO(category.id));
                const courseLessonResourceId = {
                    userId: author.id,
                    courseId: course.id,
                };
                const lesson = yield repository.courseLesson.createLesson(courseLessonResourceId, randDTO.courseLesson.generateCreateLessonDTO());
                const courseLessonVideoResourceId = Object.assign(Object.assign({}, courseLessonResourceId), { lessonId: lesson.id });
                const video = yield repository.courseLessonVideo.createVideo(courseLessonVideoResourceId, randDTO.courseLessonVideo.generateCreateLessonVideoDTO());
                yield repository.courseLessonVideo.deleteVideo(video.id, courseLessonVideoResourceId);
                const deletedVideo = yield repository.courseLessonVideo.getVideoById(video.id, courseLessonVideoResourceId);
                expect(deletedVideo).toBeNull();
                try {
                    const actual = yield sut.getVideoByIdOrThrow(video.id, courseLessonVideoResourceId, exception);
                    fail(Fail.SHOULD_THROW_AN_ERROR);
                }
                catch (error) {
                    if (exception) {
                        expect(error).toEqual(exception);
                    }
                    if (!exception) {
                        expect(error).toEqual(expect.any(RecordNotFoundException_1.default));
                    }
                }
            }));
        });
        describe("updateVideoSource", () => {
            it("video exists: should update a video source", () => __awaiter(void 0, void 0, void 0, function* () {
                const author = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
                yield repository.user.updateUser(author.id, {
                    role: course_type_1.UserRoleModel.INSTRUCTOR,
                });
                const category = yield repository.courseCategory.createCategory({ userId: author.id }, { title: "someTitle" });
                const course = yield repository.course.createCourse({
                    userId: author.id,
                }, randDTO.course.generateCreateCourseDTO(category.id));
                const courseLessonResourceId = {
                    userId: author.id,
                    courseId: course.id,
                };
                const lesson = yield repository.courseLesson.createLesson(courseLessonResourceId, randDTO.courseLesson.generateCreateLessonDTO());
                const courseLessonVideoResourceId = Object.assign(Object.assign({}, courseLessonResourceId), { lessonId: lesson.id });
                const video = yield repository.courseLessonVideo.createVideo(courseLessonVideoResourceId, randDTO.courseLessonVideo.generateCreateLessonVideoDTO());
                const expected = video;
                expect(course.totalVideos).toEqual(0);
                expect(course.totalDurations).toEqual(0);
                expect(lesson.totalVideos).toEqual(0);
                expect(lesson.totalDurations).toEqual(0);
                expect(video.totalDurations).toEqual(expect.any(Number));
                const dto = {
                    youtubeLink: video.youtubeLink + "someModifier",
                    totalDurations: video.totalDurations + 10,
                };
                const actual = yield sut.updateVideoSource(video.id, courseLessonVideoResourceId, dto);
                expect(actual).not.toEqual(expected);
                expect(actual.updatedAt).not.toEqual(expected.updatedAt);
                expect(Object.assign(Object.assign({}, actual), { updatedAt: undefined })).toEqual(Object.assign(Object.assign(Object.assign({}, expected), dto), { updatedAt: undefined }));
                const updatedCourse = yield repository.course.getCourseByIdOrThrow(course.id, courseLessonResourceId, {});
                expect(updatedCourse.totalVideos).toEqual(1);
                expect(updatedCourse.totalDurations).toEqual(dto.totalDurations);
                const updatedLesson = yield repository.courseLesson.getLessonByIdOrThrow(lesson.id, courseLessonResourceId);
                expect(updatedLesson.totalVideos).toEqual(1);
                expect(updatedLesson.totalDurations).toEqual(dto.totalDurations);
            }));
        });
        describe("deleteVideo", () => {
            it("video exists: should delete a video", () => __awaiter(void 0, void 0, void 0, function* () {
                const author = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
                yield repository.user.updateUser(author.id, {
                    role: course_type_1.UserRoleModel.INSTRUCTOR,
                });
                const category = yield repository.courseCategory.createCategory({ userId: author.id }, { title: "someTitle" });
                const course = yield repository.course.createCourse({
                    userId: author.id,
                }, randDTO.course.generateCreateCourseDTO(category.id));
                const courseLessonResourceId = {
                    userId: author.id,
                    courseId: course.id,
                };
                const lesson = yield repository.courseLesson.createLesson(courseLessonResourceId, randDTO.courseLesson.generateCreateLessonDTO());
                const courseLessonVideoResourceId = Object.assign(Object.assign({}, courseLessonResourceId), { lessonId: lesson.id });
                const video = yield repository.courseLessonVideo.createVideo(courseLessonVideoResourceId, randDTO.courseLessonVideo.generateCreateLessonVideoDTO());
                expect(course.totalVideos).toEqual(0);
                expect(course.totalDurations).toEqual(0);
                expect(lesson.totalVideos).toEqual(0);
                expect(lesson.totalDurations).toEqual(0);
                expect(video.totalDurations).toEqual(expect.any(Number));
                const actual = yield sut.deleteVideo(video.id, courseLessonVideoResourceId);
                expect(actual).toEqual({});
                expect(yield repository.courseLessonVideo.getVideoById(video.id, courseLessonVideoResourceId)).toBeNull();
                const updatedCourse = yield repository.course.getCourseByIdOrThrow(course.id, courseLessonResourceId, {});
                expect(updatedCourse.totalVideos).toEqual(0);
                expect(updatedCourse.totalDurations).toEqual(0);
                const updatedLesson = yield repository.courseLesson.getLessonByIdOrThrow(lesson.id, courseLessonResourceId);
                expect(updatedLesson.totalVideos).toEqual(0);
                expect(updatedLesson.totalDurations).toEqual(0);
            }));
        });
    });
});
