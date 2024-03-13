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
const lesson_type_1 = require("../lesson.type");
const lesson_authorization_1 = __importDefault(require("../authorization/lesson.authorization"));
const course_type_1 = require("../../course/course.type");
const rand_dto_type_1 = require("../../../common/class/rand_dto/rand_dto.type");
const repository_type_1 = require("../../../common/class/repository/repository.type");
const ClientException_1 = __importDefault(require("../../../common/class/exceptions/ClientException"));
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
const isEqualOrIncludeRole_1 = __importDefault(require("../../../common/functions/isEqualOrIncludeRole"));
var Fail;
(function (Fail) {
    Fail["SHOULD_NOT_THROW_AN_ERROR"] = "Shouldn't throw an error";
    Fail["SHOULD_THROW_AN_ERROR"] = "Should throw an error";
})(Fail || (Fail = {}));
/**
 * Authorization mock function
 *
 */
const mockAuthorizeCreateLesson = jest.fn();
const mockAuthorizeUpdateLesson = jest.fn();
const mockAuthorizeDeleteLesson = jest.fn();
/**
 * Resource Id
 *
 */
describe("CourseLessonRepository Test Suite", () => {
    let sut;
    let repository;
    let randDTO;
    beforeAll(() => {
        inversifyConfig_1.default.unbind(lesson_type_1.CourseLessonDITypes.AUTHORIZATION);
        inversifyConfig_1.default
            .bind(lesson_type_1.CourseLessonDITypes.AUTHORIZATION)
            .toConstantValue({
            authorizeCreateLesson: mockAuthorizeCreateLesson,
            authorizeUpdateLesson: mockAuthorizeUpdateLesson,
            authorizeDeleteLesson: mockAuthorizeDeleteLesson,
        });
        repository = inversifyConfig_1.default.get(repository_type_1.RepositoryDITypes.FACADE);
        randDTO = inversifyConfig_1.default.get(rand_dto_type_1.RandDTODITypes.FACADE);
    });
    afterAll(() => {
        inversifyConfig_1.default.unbind(lesson_type_1.CourseLessonDITypes.AUTHORIZATION);
        inversifyConfig_1.default
            .bind(lesson_type_1.CourseLessonDITypes.AUTHORIZATION)
            .to(lesson_authorization_1.default);
    });
    beforeEach(() => {
        sut = inversifyConfig_1.default.get(lesson_type_1.CourseLessonDITypes.REPOSITORY);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("CourseLessonRepository Test Suite", () => {
        it("createLesson", () => __awaiter(void 0, void 0, void 0, function* () {
            const author = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
            yield repository.user.unauthorizedUpdateUser(author.id, {
                role: course_type_1.UserRoleModel.INSTRUCTOR,
            });
            const category = yield repository.courseCategory.createCategory({ userId: author.id }, { title: "someTitle" });
            const course = yield repository.course.createCourse({
                userId: author.id,
            }, randDTO.course.generateCreateCourseDTO(category.id));
            const resourceId = {
                userId: author.id,
                courseId: course.id,
            };
            const dto = {
                title: "someTitle",
            };
            expect(course.totalLessons).toEqual(0);
            const actual = yield sut.createLesson(resourceId, dto);
            expect(actual.id).toBeDefined();
            const expected = yield repository.courseLesson.getLessonByIdOrThrow(actual.id, resourceId);
            expect(expected).toBeDefined();
            expect(expected).toEqual(actual);
            const updatedCourse = yield repository.course.getCourseByIdOrThrow(course.id, resourceId, {});
            expect(updatedCourse).toBeDefined();
            expect(Object.assign(Object.assign({}, updatedCourse), { totalLessons: undefined, updatedAt: undefined })).toEqual(Object.assign(Object.assign({}, course), { totalLessons: undefined, updatedAt: undefined }));
            expect(updatedCourse.updatedAt).not.toEqual(course.updatedAt);
            expect(updatedCourse.totalLessons).not.toEqual(course.totalLessons);
            expect(updatedCourse.totalLessons).toEqual(1);
        }));
        it("getLessonById", () => __awaiter(void 0, void 0, void 0, function* () {
            const author = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
            yield repository.user.unauthorizedUpdateUser(author.id, {
                role: course_type_1.UserRoleModel.INSTRUCTOR,
            });
            const category = yield repository.courseCategory.createCategory({ userId: author.id }, { title: "someTitle" });
            const course = yield repository.course.createCourse({ userId: author.id }, randDTO.course.generateCreateCourseDTO(category.id));
            const resourceId = {
                userId: author.id,
                courseId: course.id,
            };
            const dto = {
                title: "someTitle",
            };
            const lesson = yield repository.courseLesson.createLesson(resourceId, dto);
            const actual = yield sut.getLessonById(lesson.id, {
                courseId: course.id,
            });
            expect(actual).not.toBeNull();
            expect(actual).toBeDefined();
            const expected = lesson;
            expect(expected).toBeDefined();
            expect(expected).toEqual(actual);
        }));
        it.each([
            { exception: new ClientException_1.default() },
            {},
        ])("getLessonByIdOrThrow", ({ exception }) => __awaiter(void 0, void 0, void 0, function* () {
            const author = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
            yield repository.user.unauthorizedUpdateUser(author.id, {
                role: course_type_1.UserRoleModel.INSTRUCTOR,
            });
            const category = yield repository.courseCategory.createCategory({ userId: author.id }, { title: "someTitle" });
            const course = yield repository.course.createCourse({
                userId: author.id,
            }, randDTO.course.generateCreateCourseDTO(category.id));
            const resourceId = {
                userId: author.id,
                courseId: course.id,
            };
            const dto = {
                title: "someTitle",
            };
            const lesson = yield repository.courseLesson.createLesson(resourceId, dto);
            yield repository.courseLesson.deleteLesson(lesson.id, resourceId);
            const deletedLesson = yield repository.courseLesson.getLessonById(lesson.id, {
                courseId: course.id,
            });
            expect(deletedLesson).toBeNull();
            try {
                const actual = yield sut.getLessonByIdOrThrow(lesson.id, {
                    courseId: course.id,
                }, exception);
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
        it("updateLesson", () => __awaiter(void 0, void 0, void 0, function* () {
            const author = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
            yield repository.user.unauthorizedUpdateUser(author.id, {
                role: course_type_1.UserRoleModel.INSTRUCTOR,
            });
            const category = yield repository.courseCategory.createCategory({ userId: author.id }, { title: "someTitle" });
            const course = yield repository.course.createCourse({
                userId: author.id,
            }, randDTO.course.generateCreateCourseDTO(category.id));
            const resourceId = {
                userId: author.id,
                courseId: course.id,
            };
            const dto = {
                title: "someNewTitle",
                description: "someNewDescription",
            };
            const lesson = yield repository.courseLesson.createLesson(resourceId, {
                title: "someTitle",
            });
            const expected = lesson;
            expect(expected).toBeDefined();
            const actual = yield sut.updateLesson(lesson.id, resourceId, dto);
            expect(actual).toBeDefined();
            expect(expected.updatedAt).not.toEqual(actual.updatedAt);
            expect(Object.assign(Object.assign({}, expected), { updatedAt: undefined })).not.toEqual(Object.assign(Object.assign({}, actual), { updatedAt: undefined }));
            expect(Object.assign(Object.assign(Object.assign({}, expected), dto), { updatedAt: undefined })).toEqual(Object.assign(Object.assign(Object.assign({}, actual), dto), { updatedAt: undefined }));
        }));
        it("deleteLesson", () => __awaiter(void 0, void 0, void 0, function* () {
            const author = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
            yield repository.user.unauthorizedUpdateUser(author.id, {
                role: course_type_1.UserRoleModel.OWNER,
            });
            const user = yield repository.user.getUserByIdOrThrow(author.id);
            expect((0, isEqualOrIncludeRole_1.default)(user.role, course_type_1.UserRoleModel.OWNER)).toBe(true);
            const category = yield repository.courseCategory.createCategory({ userId: author.id }, { title: "someTitle" });
            expect(category).toBeDefined();
            const { id: courseId } = yield repository.course.createCourse({
                userId: author.id,
            }, randDTO.course.generateCreateCourseDTO(category.id));
            const resourceId = {
                userId: author.id,
                courseId: courseId,
            };
            const { id: lessonId } = yield repository.courseLesson.createLesson(resourceId, {
                title: "someTitle",
            });
            const videoDuration = 10;
            const videoResourceId = {
                userId: user.id,
                courseId,
                lessonId,
            };
            const { id: videoId } = yield repository.courseLessonVideo.createVideo(videoResourceId, {
                name: "someName",
                description: "someDescription",
                youtubeLink: "someYoutubeLink",
                totalDurations: videoDuration,
            });
            const course = yield repository.course.getCourseByIdOrThrow(courseId, resourceId, {});
            expect(course).toBeDefined();
            expect(course.totalLessons).toBe(1);
            expect(course.totalVideos).toBe(1);
            expect(course.totalDurations).toBe(videoDuration);
            const lesson = yield repository.courseLesson.getLessonByIdOrThrow(lessonId, {
                courseId: course.id,
            });
            expect(lesson).toBeDefined();
            expect(lesson.totalVideos).toBe(1);
            expect(lesson.totalDurations).toBe(videoDuration);
            const video = yield repository.courseLessonVideo.getVideoByIdOrThrow(videoId, videoResourceId);
            expect(video).toBeDefined();
            expect(video);
            const expected = lesson;
            const actual = yield sut.deleteLesson(lessonId, resourceId);
            expect(actual).not.toEqual(expected);
            expect(actual).toEqual({});
            const courseAfterDeletion = yield repository.course.getCourseByIdOrThrow(courseId, resourceId, {});
            expect(courseAfterDeletion).toBeDefined();
            expect(courseAfterDeletion.totalLessons).toBe(0);
            expect(courseAfterDeletion.totalVideos).toBe(0);
            expect(courseAfterDeletion.totalDurations).toBe(0);
            expect(Object.assign(Object.assign({}, course), { totalLessons: undefined, totalVideos: undefined, totalDurations: undefined, updatedAt: undefined })).toEqual(Object.assign(Object.assign({}, courseAfterDeletion), { totalLessons: undefined, totalVideos: undefined, totalDurations: undefined, updatedAt: undefined }));
            const lessonAfterDeletion = yield repository.courseLesson.getLessonById(lessonId, {
                courseId: course.id,
            });
            expect(lessonAfterDeletion).toBeNull();
            const videoAfterDeletion = yield repository.courseLessonVideo.getVideoById(videoId, {
                userId: author.id,
                courseId,
                lessonId,
            });
            expect(videoAfterDeletion).toBeNull();
        }));
    });
});
