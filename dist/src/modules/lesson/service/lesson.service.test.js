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
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const lesson_type_1 = require("../lesson.type");
const lesson_repository_1 = require("../repository/lesson.repository");
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
var Fail;
(function (Fail) {
    Fail["SHOULD_THROW_AN_ERROR"] = "Should throw an error!";
    Fail["SHOULD_NOT_THROW_AN_ERROR"] = "Should not throw an error!";
})(Fail || (Fail = {}));
const mockCreateLesson = jest.fn();
const mockGetLessonById = jest.fn();
const mockUpdateLesson = jest.fn();
const mockDeleteLesson = jest.fn();
describe("CourseLessonService Test Suites", () => {
    let sut;
    beforeAll(() => {
        inversifyConfig_1.default.unbind(lesson_type_1.CourseLessonDITypes.REPOSITORY);
        inversifyConfig_1.default
            .bind(lesson_type_1.CourseLessonDITypes.REPOSITORY)
            .toConstantValue({
            createLesson: mockCreateLesson,
            getLessonById: mockGetLessonById,
            getLessonByIdOrThrow: jest.fn(),
            updateLesson: mockUpdateLesson,
            deleteLesson: mockDeleteLesson,
        });
    });
    afterAll(() => {
        inversifyConfig_1.default.unbind(lesson_type_1.CourseLessonDITypes.REPOSITORY);
        inversifyConfig_1.default
            .bind(lesson_type_1.CourseLessonDITypes.REPOSITORY)
            .to(lesson_repository_1.CourseLessonRepository);
    });
    beforeEach(() => {
        sut = inversifyConfig_1.default.get(lesson_type_1.CourseLessonDITypes.SERVICE);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("createLesson", () => {
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const createdLesson = {};
            mockCreateLesson.mockReturnValueOnce(createdLesson);
            /**
             * Act
             *
             */
            const actual = yield sut.createLesson(undefined, undefined);
            /**
             * Assert
             *
             */
            expect(mockCreateLesson).toBeCalledTimes(1);
            expect(createdLesson).toEqual(actual);
        }));
    });
    describe("getLessonById", () => {
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const lesson = { id: 1 };
            mockGetLessonById.mockReturnValueOnce(lesson);
            /**
             * Act
             *
             */
            const actual = yield sut.getLessonById(undefined, undefined);
            /**
             * Assert
             *
             */
            expect(mockGetLessonById).toBeCalledTimes(1);
            expect(lesson).toEqual(actual);
        }));
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            mockGetLessonById.mockReturnValueOnce(null);
            try {
                /**
                 * Act
                 *
                 */
                yield sut.getLessonById(undefined, undefined);
                fail(Fail.SHOULD_THROW_AN_ERROR);
            }
            catch (error) {
                /**
                 * Assert
                 *
                 */
                expect(mockGetLessonById).toBeCalledTimes(1);
                expect(error).toBeInstanceOf(RecordNotFoundException_1.default);
            }
        }));
    });
    describe("updateLesson", () => {
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            mockGetLessonById.mockReturnValueOnce({ id: 1 });
            const updatedLesson = { id: 1, title: "updatedTitle" };
            mockUpdateLesson.mockReturnValueOnce(updatedLesson);
            /**
             * Act
             *
             */
            const actual = yield sut.updateLesson(undefined, undefined, undefined);
            /**
             * Assert
             *
             */
            expect(mockGetLessonById).toBeCalledTimes(1);
            expect(mockUpdateLesson).toBeCalledTimes(1);
            expect(updatedLesson).toEqual(actual);
        }));
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            mockGetLessonById.mockReturnValueOnce(null);
            try {
                /**
                 * Act
                 *
                 */
                yield sut.updateLesson(undefined, undefined, undefined);
                fail(Fail.SHOULD_THROW_AN_ERROR);
            }
            catch (error) {
                /**
                 * Assert
                 *
                 */
                expect(mockGetLessonById).toBeCalledTimes(1);
                expect(mockUpdateLesson).not.toBeCalled();
                expect(error).toBeInstanceOf(RecordNotFoundException_1.default);
            }
        }));
    });
    describe("deleteLesson", () => {
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            mockGetLessonById.mockReturnValueOnce({ id: 1 });
            /**
             * Act
             *
             */
            const actual = yield sut.deleteLesson(undefined, undefined);
            /**
             * Assert
             *
             */
            expect(mockGetLessonById).toBeCalledTimes(1);
            expect(mockDeleteLesson).toBeCalledTimes(1);
            expect({}).toEqual(actual);
        }));
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            mockGetLessonById.mockReturnValueOnce(null);
            try {
                /**
                 * Act
                 *
                 */
                yield sut.deleteLesson(undefined, undefined);
                fail(Fail.SHOULD_THROW_AN_ERROR);
            }
            catch (error) {
                /**
                 * Assert
                 *
                 */
                expect(mockGetLessonById).toBeCalledTimes(1);
                expect(mockDeleteLesson).not.toBeCalled();
                expect(error).toBeInstanceOf(RecordNotFoundException_1.default);
            }
        }));
    });
});
