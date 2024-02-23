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
const course_service_1 = require("./course.service");
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const course_type_1 = require("../course.type");
const course_repository_1 = require("../repository/course.repository");
const ClientException_1 = __importDefault(require("../../../common/class/exceptions/ClientException"));
const mockCreateCourse = jest.fn();
const mockGetCourseById = jest.fn();
const mockGetCourseByIdOrThrow = jest.fn();
const mockUpdateCourse = jest.fn();
const mockUpdateBasicCourse = jest.fn();
const mockDeleteCourse = jest.fn();
const mockCreateLike = jest.fn();
const mockGetLikeById = jest.fn();
const mockgetLikeByIdOrThrow = jest.fn();
const mockDeleteLike = jest.fn();
describe("CourseService Test Suites", () => {
    let sut;
    beforeAll(() => {
        inversifyConfig_1.default.unbind(course_type_1.CourseDITypes.REPOSITORY);
        inversifyConfig_1.default
            .bind(course_type_1.CourseDITypes.REPOSITORY)
            .toConstantValue({
            createCourse: mockCreateCourse,
            getCourseById: mockGetCourseById,
            getCourses: jest.fn(),
            getEnrolledCourses: jest.fn(),
            getCourseByIdOrThrow: mockGetCourseByIdOrThrow,
            updateCourse: mockUpdateCourse,
            updateBasicCourse: mockUpdateBasicCourse,
            deleteCourse: mockDeleteCourse,
            createLike: mockCreateLike,
            getLikeById: mockGetLikeById,
            getLikeByIdOrThrow: mockgetLikeByIdOrThrow,
            deleteLike: mockDeleteLike,
        });
    });
    afterAll(() => {
        inversifyConfig_1.default.unbind(course_type_1.CourseDITypes.REPOSITORY);
        inversifyConfig_1.default
            .bind(course_type_1.CourseDITypes.REPOSITORY)
            .to(course_repository_1.CourseRepository);
    });
    beforeEach(() => {
        sut = inversifyConfig_1.default.get(course_type_1.CourseDITypes.SERVICE);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("createCourse", () => {
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const createdCourse = {};
            mockCreateCourse.mockReturnValueOnce(createdCourse);
            /**
             * Act
             *
             */
            const actual = yield sut.createCourse(undefined, undefined);
            /**
             * Assert
             *
             */
            expect(mockCreateCourse).toBeCalledTimes(1);
            expect(actual).toEqual(createdCourse);
        }));
    });
    describe("getCourseById", () => {
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const course = { id: 1 };
            mockGetCourseByIdOrThrow.mockReturnValueOnce(course);
            /**
             * Act
             *
             */
            const actual = yield sut.getCourseById(undefined, undefined, undefined);
            /**
             * Assert
             *
             */
            expect(mockGetCourseByIdOrThrow).toBeCalledTimes(1);
            expect(actual).toEqual(course);
        }));
    });
    describe("updateBasicCourse", () => {
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const updatedCourse = { id: 1 };
            mockUpdateBasicCourse.mockReturnValueOnce(updatedCourse);
            /**
             * Act
             *
             */
            const actual = yield sut.updateBasicCourse(undefined, undefined, undefined);
            /**
             * Assert
             *
             */
            expect(mockUpdateBasicCourse).toBeCalledTimes(1);
            expect(actual).toEqual(updatedCourse);
        }));
    });
    describe("deleteCourse", () => {
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const courseId = 1;
            const resourceId = {};
            const deletedCourse = {};
            mockDeleteCourse.mockReturnValueOnce(deletedCourse);
            /**
             * Act
             *
             */
            const actual = yield sut.deleteCourse(courseId, resourceId);
            /**
             * Assert
             *
             */
            expect(mockDeleteCourse).toBeCalledTimes(1);
            expect(mockDeleteCourse).toBeCalledWith(courseId, resourceId);
            expect(actual).toEqual(deletedCourse);
        }));
    });
    describe("createLike", () => {
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const resourceId = {};
            const createdLike = { id: 1 };
            mockCreateLike.mockReturnValueOnce(createdLike);
            /**
             * Act
             *
             */
            const actual = yield sut.createLike(resourceId);
            /**
             * Assert
             *
             */
            expect(mockCreateLike).toBeCalledTimes(1);
            expect(mockCreateLike).toBeCalledWith(resourceId);
            expect(actual).toEqual(createdLike);
        }));
    });
    describe("deleteLike", () => {
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const likeId = 1;
            const resourceId = {};
            const deletedLike = {};
            mockDeleteLike.mockReturnValueOnce(deletedLike);
            const mockvalidateRelationBetweenResources = jest.fn();
            jest
                .spyOn(course_service_1.CourseService.prototype, "validateRelationBetweenResources")
                .mockImplementationOnce(mockvalidateRelationBetweenResources);
            /**
             * Act
             *
             */
            const actual = yield sut.deleteLike(likeId, resourceId);
            /**
             * Assert
             *
             */
            expect(mockDeleteLike).toBeCalledTimes(1);
            expect(mockDeleteLike).toBeCalledWith(likeId, resourceId);
            expect(actual).toEqual(deletedLike);
        }));
    });
    describe("validateRelationBetweenResources", () => {
        it("valid relation: should return like", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const likeId = 1;
            const resourceId = {
                userId: 1,
                courseId: 1,
            };
            const like = {
                courseId: resourceId.courseId,
            };
            mockGetLikeById.mockReturnValueOnce(like);
            /**
             * Act
             *
             */
            const actual = yield sut.validateRelationBetweenResources({
                likeId,
                resourceId,
            });
            /**
             * Assert
             *
             */
            expect(mockGetLikeById).toBeCalledTimes(1);
            expect(mockGetLikeById).toBeCalledWith(likeId, resourceId);
            expect(actual).toEqual(like);
        }));
        it("like doesn't exist, error is not specified: should return null", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const likeId = 1;
            const resourceId = {};
            mockGetLikeById.mockReturnValueOnce(null);
            /**
             * Act
             *
             */
            const actual = yield sut.validateRelationBetweenResources({
                likeId,
                resourceId,
            });
            /**
             * Assert
             *
             */
            expect(mockGetLikeById).toBeCalledTimes(1);
            expect(mockGetLikeById).toBeCalledWith(likeId, resourceId);
            expect(actual).toBeNull();
        }));
        it("invalid relation, error is not specified: should return null", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const likeId = 1;
            const resourceId = {
                userId: 1,
                courseId: 1,
            };
            mockGetLikeById.mockReturnValueOnce({
                courseId: resourceId.courseId + 1,
            });
            /**
             * Act
             *
             */
            const actual = yield sut.validateRelationBetweenResources({
                likeId,
                resourceId,
            });
            /**
             * Assert
             *
             */
            expect(mockGetLikeById).toBeCalledTimes(1);
            expect(mockGetLikeById).toBeCalledWith(likeId, resourceId);
            expect(actual).toBeNull();
        }));
        it("like doesn't exist, error is specified: should throw the error", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const likeId = 1;
            const resourceId = {};
            const exception = new ClientException_1.default();
            mockGetLikeById.mockReturnValueOnce(null);
            try {
                /**
                 * Act
                 *
                 */
                const actual = yield sut.validateRelationBetweenResources({
                    likeId,
                    resourceId,
                }, exception);
                fail("Should throw an error");
            }
            catch (error) {
                expect(exception).toEqual(error);
                /**
                 * Assert
                 *
                 */
                expect(mockGetLikeById).toBeCalledTimes(1);
                expect(mockGetLikeById).toBeCalledWith(likeId, resourceId);
            }
        }));
    });
});
