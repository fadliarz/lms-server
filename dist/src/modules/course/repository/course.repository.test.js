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
const repository_type_1 = require("../../../common/class/repository/repository.type");
const rand_dto_type_1 = require("../../../common/class/rand_dto/rand_dto.type");
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const course_type_1 = require("../course.type");
const course_authorization_1 = require("../authorization/course.authorization");
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
const ClientException_1 = __importDefault(require("../../../common/class/exceptions/ClientException"));
var Fail;
(function (Fail) {
    Fail["SHOULD_NOT_THROW_AN_ERROR"] = "Shouldn't throw an error";
    Fail["SHOULD_THROW_AN_ERROR"] = "Should throw an error";
    Fail["COURSE_SHOULD_NOT_BE_NULL"] = "Course should not be null";
    Fail["COURSE_SHOULD_BE_NULL"] = "Course should be null";
    Fail["LIKE_SHOULD_NOT_BE_NULL"] = "Like should not be null";
    Fail["LIKE_SHOULD_BE_NULL"] = "Like should be null";
})(Fail || (Fail = {}));
/**
 * Authorization mock function
 *
 */
const mockAuthorizeCreateCourse = jest.fn();
const mockAuthorizeUpdateBasicCourse = jest.fn();
const mockAuthorizeDeleteCourse = jest.fn();
const mockAuthorizeCreateLike = jest.fn();
const mockAuthorizeDeleteLike = jest.fn();
describe("CourseRepository Test Suites", () => {
    let sut;
    let repository;
    let randDTO;
    beforeAll(() => {
        inversifyConfig_1.default.unbind(course_type_1.CourseDITypes.AUTHORIZATION);
        inversifyConfig_1.default
            .bind(course_type_1.CourseDITypes.AUTHORIZATION)
            .toConstantValue({
            authorizeCreateCourse: mockAuthorizeCreateCourse,
            authorizeUpdateBasicCourse: mockAuthorizeUpdateBasicCourse,
            authorizeDeleteCourse: mockAuthorizeDeleteCourse,
            authorizeCreateLike: mockAuthorizeCreateLike,
            authorizeDeleteLike: mockAuthorizeDeleteLike,
        });
        repository = inversifyConfig_1.default.get(repository_type_1.RepositoryDITypes.FACADE);
        randDTO = inversifyConfig_1.default.get(rand_dto_type_1.RandDTODITypes.FACADE);
    });
    afterAll(() => {
        inversifyConfig_1.default.unbind(course_type_1.CourseDITypes.AUTHORIZATION);
        inversifyConfig_1.default
            .bind(course_type_1.CourseDITypes.AUTHORIZATION)
            .to(course_authorization_1.CourseAuthorization);
    });
    beforeEach(() => {
        sut = inversifyConfig_1.default.get(course_type_1.CourseDITypes.REPOSITORY);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("createCourse", () => {
        it("valid dto: should create a course and return the course", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const { id: authorId } = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
            yield repository.user.updateUser(authorId, {
                role: course_type_1.UserRoleModel.INSTRUCTOR,
            });
            const { id: categoryId } = yield repository.courseCategory.createCategory({ userId: authorId }, { title: "someTitle" });
            const courseResourceId = {
                userId: authorId,
            };
            const dto = yield randDTO.course.generateCreateCourseDTO(categoryId);
            /**
             * Act
             *
             */
            const actual = yield sut.createCourse(courseResourceId, dto);
            const createdCourse = yield repository.course.getCourseById(actual.id, courseResourceId, {});
            if (!createdCourse) {
                fail(Fail.COURSE_SHOULD_NOT_BE_NULL);
            }
            /**
             * Assert
             *
             */
            expect(mockAuthorizeCreateCourse).toBeCalledTimes(1);
            expect(actual).toBeDefined();
            expect(createdCourse).toBeDefined();
            expect(createdCourse).toEqual(actual);
            expect(createdCourse.id).toEqual(expect.any(Number));
            expect(createdCourse.title).toEqual(dto.title);
            expect(createdCourse.categoryId).toEqual(dto.categoryId);
        }));
    });
    describe("getCourseById", () => {
        it("valid course: should return a course", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const { id: authorId } = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
            yield repository.user.updateUser(authorId, {
                role: course_type_1.UserRoleModel.INSTRUCTOR,
            });
            const { id: categoryId } = yield repository.courseCategory.createCategory({ userId: authorId }, { title: "someTitle" });
            const courseResourceId = {
                userId: authorId,
            };
            const course = yield repository.course.createCourse(courseResourceId, randDTO.course.generateCreateCourseDTO(categoryId));
            /**
             * Act
             *
             */
            const actual = yield sut.getCourseById(course.id, courseResourceId, {});
            /**
             * Arrange
             *
             */
            expect(actual).toBeDefined();
            expect(course).toBeDefined();
            expect(course).toEqual(actual);
        }));
        it("course doesn't exist: should return null", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const { id: authorId } = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
            yield repository.user.updateUser(authorId, {
                role: course_type_1.UserRoleModel.INSTRUCTOR,
            });
            const { id: categoryId } = yield repository.courseCategory.createCategory({ userId: authorId }, { title: "someTitle" });
            const courseResourceId = {
                userId: authorId,
            };
            const course = yield repository.course.createCourse(courseResourceId, randDTO.course.generateCreateCourseDTO(categoryId));
            yield repository.course.deleteCourse(course.id, courseResourceId);
            /**
             * Act
             *
             */
            const actual = yield sut.getCourseById(course.id, courseResourceId, {});
            /**
             * Arrange
             *
             */
            expect(actual).toBeNull();
        }));
        it("valid course and query: should return a course and its author & category ", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            /**
             * Arrange
             *
             */
            const { id: authorId } = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
            yield repository.user.updateUser(authorId, {
                role: course_type_1.UserRoleModel.INSTRUCTOR,
            });
            const category = yield repository.courseCategory.createCategory({ userId: authorId }, { title: "someTitle" });
            const courseResourceId = {
                userId: authorId,
            };
            const course = yield repository.course.createCourse(courseResourceId, randDTO.course.generateCreateCourseDTO(category.id));
            /**
             * Act
             *
             */
            const actual = yield sut.getCourseById(course.id, courseResourceId, {
                include_author: true,
                include_category: true,
            });
            if (!actual) {
                fail(Fail.COURSE_SHOULD_NOT_BE_NULL);
            }
            /**
             * Arrange
             *
             */
            expect(actual).toBeDefined();
            expect(course).toBeDefined();
            expect(course).not.toEqual(actual);
            expect(Object.assign(Object.assign({}, course), { category: undefined, author: undefined })).toEqual(Object.assign(Object.assign({}, actual), { category: undefined, author: undefined }));
            expect(authorId).toEqual((_a = actual === null || actual === void 0 ? void 0 : actual.author) === null || _a === void 0 ? void 0 : _a.id);
            expect(category).toEqual(actual.category);
        }));
    });
    describe("getCourseByIdOrThrow", () => {
        it("valid course: should return a course", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const { id: authorId } = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
            yield repository.user.updateUser(authorId, {
                role: course_type_1.UserRoleModel.INSTRUCTOR,
            });
            const { id: categoryId } = yield repository.courseCategory.createCategory({ userId: authorId }, { title: "someTitle" });
            const courseResourceId = {
                userId: authorId,
            };
            const course = yield repository.course.createCourse(courseResourceId, randDTO.course.generateCreateCourseDTO(categoryId));
            /**
             * Act
             *
             */
            const actual = yield sut.getCourseByIdOrThrow(course.id, courseResourceId, {});
            /**
             * Arrange
             *
             */
            expect(actual).toBeDefined();
            expect(course).toBeDefined();
            expect(course).toEqual(actual);
        }));
        it("course doesn't exist, error is specified: should throw the error ", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const { id: authorId } = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
            yield repository.user.updateUser(authorId, {
                role: course_type_1.UserRoleModel.INSTRUCTOR,
            });
            const { id: categoryId } = yield repository.courseCategory.createCategory({ userId: authorId }, { title: "someTitle" });
            const courseResourceId = {
                userId: authorId,
            };
            const course = yield sut.createCourse(courseResourceId, randDTO.course.generateCreateCourseDTO(categoryId));
            const exception = new RecordNotFoundException_1.default();
            yield repository.course.deleteCourse(course.id, courseResourceId);
            try {
                /**
                 * Act
                 *
                 */
                const actual = yield sut.getCourseByIdOrThrow(course.id, courseResourceId, {}, exception);
                fail(Fail.SHOULD_THROW_AN_ERROR);
            }
            catch (error) {
                /**
                 * Arrange
                 *
                 */
                expect(exception).toEqual(error);
            }
        }));
        it("course doesn't exist, error is not specified, should throw RecordNotFoundException", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const { id: authorId } = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
            yield repository.user.updateUser(authorId, {
                role: course_type_1.UserRoleModel.INSTRUCTOR,
            });
            const { id: categoryId } = yield repository.courseCategory.createCategory({ userId: authorId }, { title: "someTitle" });
            const courseResourceId = {
                userId: authorId,
            };
            const course = yield sut.createCourse(courseResourceId, randDTO.course.generateCreateCourseDTO(categoryId));
            yield repository.course.deleteCourse(course.id, courseResourceId);
            try {
                /**
                 * Act
                 *
                 */
                const actual = yield sut.getCourseByIdOrThrow(course.id, courseResourceId, {});
                fail(Fail.SHOULD_THROW_AN_ERROR);
            }
            catch (error) {
                /**
                 * Arrange
                 *
                 */
                expect(error).toBeInstanceOf(RecordNotFoundException_1.default);
            }
        }));
    });
    describe("updateBasicCourse", () => {
        it("valid course: should update the course and return the updated course", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const { id: authorId } = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
            yield repository.user.updateUser(authorId, {
                role: course_type_1.UserRoleModel.INSTRUCTOR,
            });
            const { id: categoryId } = yield repository.courseCategory.createCategory({ userId: authorId }, { title: "someTitle" });
            const courseResourceId = {
                userId: authorId,
            };
            const course = yield repository.course.createCourse(courseResourceId, randDTO.course.generateCreateCourseDTO(categoryId));
            const dto = {
                image: "modified".concat(course.image),
                title: "modified".concat(course.title),
            };
            /**
             * Act
             *
             */
            const actual = yield sut.updateBasicCourse(course.id, courseResourceId, dto);
            /**
             * Arrange
             *
             */
            expect(mockAuthorizeUpdateBasicCourse).toBeCalledTimes(1);
            expect(actual).toBeDefined();
            expect(course).toBeDefined();
            expect(course.image).not.toEqual(actual.image);
            expect(course.title).not.toEqual(actual.title);
            expect(Object.assign(Object.assign({}, course), { image: undefined, title: undefined, updatedAt: undefined })).toEqual(Object.assign(Object.assign({}, actual), { image: undefined, title: undefined, updatedAt: undefined }));
        }));
        it.todo("course doesn't exist");
    });
    describe("updateCourse", () => {
        it("valid course: should update the course and return the updated course", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const { id: authorId } = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
            yield repository.user.updateUser(authorId, {
                role: course_type_1.UserRoleModel.INSTRUCTOR,
            });
            const { id: categoryId } = yield repository.courseCategory.createCategory({ userId: authorId }, { title: "someTitle" });
            const courseResourceId = {
                userId: authorId,
            };
            const course = yield repository.course.createCourse(courseResourceId, randDTO.course.generateCreateCourseDTO(categoryId));
            const dto = {
                image: "modified".concat(course.image),
                title: "modified".concat(course.title),
            };
            /**
             * Act
             *
             */
            const actual = yield sut.updateCourse(course.id, courseResourceId, dto);
            /**
             * Arrange
             *
             */
            expect(mockAuthorizeUpdateBasicCourse).toBeCalledTimes(1);
            expect(actual).toBeDefined();
            expect(course).toBeDefined();
            expect(course.image).not.toEqual(actual.image);
            expect(course.title).not.toEqual(actual.title);
            expect(Object.assign(Object.assign({}, course), { image: undefined, title: undefined, updatedAt: undefined })).toEqual(Object.assign(Object.assign({}, actual), { image: undefined, title: undefined, updatedAt: undefined }));
        }));
        it.todo("course doesn't exist");
    });
    describe("deleteCourse", () => {
        it("valid course: should delete the course and return an empty object", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const { id: authorId } = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
            yield repository.user.updateUser(authorId, {
                role: course_type_1.UserRoleModel.INSTRUCTOR,
            });
            const { id: categoryId } = yield repository.courseCategory.createCategory({ userId: authorId }, { title: "someTitle" });
            const courseResourceId = {
                userId: authorId,
            };
            const dto = yield randDTO.course.generateCreateCourseDTO(categoryId);
            const { id: courseId } = yield repository.course.createCourse(courseResourceId, dto);
            /**
             * Act
             *
             */
            const actual = yield sut.deleteCourse(courseId, courseResourceId);
            const deletedCourse = yield repository.course.getCourseById(courseId, courseResourceId, {});
            /**
             * Assert
             *
             */
            expect(mockAuthorizeDeleteCourse).toBeCalledTimes(1);
            expect(actual).toEqual({});
            expect(deletedCourse).toBeNull();
        }));
    });
    describe("createLike", () => {
        it("valid dto: should create a like and return the like", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const { id: authorId } = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
            yield repository.user.updateUser(authorId, {
                role: course_type_1.UserRoleModel.INSTRUCTOR,
            });
            const { id: categoryId } = yield repository.courseCategory.createCategory({ userId: authorId }, { title: "someTitle" });
            const courseResourceId = {
                userId: authorId,
            };
            const { id: courseId } = yield repository.course.createCourse(courseResourceId, randDTO.course.generateCreateCourseDTO(categoryId));
            const courseLikeResourceId = Object.assign(Object.assign({}, courseResourceId), { courseId });
            /**
             * Act
             *
             */
            const actual = yield sut.createLike(courseLikeResourceId);
            const createdLike = yield repository.course.getLikeById(actual.id, courseLikeResourceId);
            if (!createdLike) {
                fail(Fail.LIKE_SHOULD_NOT_BE_NULL);
            }
            /**
             * Assert
             *
             */
            expect(mockAuthorizeCreateLike).toBeCalledTimes(1);
            expect(actual).toBeDefined();
            expect(createdLike).toBeDefined();
            expect(createdLike).toEqual(actual);
            expect(createdLike.id).toEqual(expect.any(Number));
            expect(createdLike.userId).toEqual(courseLikeResourceId.userId);
            expect(createdLike.courseId).toEqual(courseLikeResourceId.courseId);
        }));
        it.todo("course doesn't exist");
    });
    describe("getLikeById", () => {
        it("valid like: should return a like", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const { id: authorId } = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
            yield repository.user.updateUser(authorId, {
                role: course_type_1.UserRoleModel.INSTRUCTOR,
            });
            const { id: categoryId } = yield repository.courseCategory.createCategory({ userId: authorId }, { title: "someTitle" });
            const courseResourceId = {
                userId: authorId,
            };
            const { id: courseId } = yield repository.course.createCourse(courseResourceId, randDTO.course.generateCreateCourseDTO(categoryId));
            const courseLikeResourceId = Object.assign(Object.assign({}, courseResourceId), { courseId });
            const like = yield repository.course.createLike(courseLikeResourceId);
            /**
             * Act
             *
             */
            const actual = yield sut.getLikeById(like.id, courseLikeResourceId);
            /**
             * Assert
             *
             */
            expect(actual).toBeDefined();
            expect(actual).toEqual(like);
        }));
        it("like doesn't exist: should return null", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const { id: authorId } = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
            yield repository.user.updateUser(authorId, {
                role: course_type_1.UserRoleModel.INSTRUCTOR,
            });
            const { id: categoryId } = yield repository.courseCategory.createCategory({ userId: authorId }, { title: "someTitle" });
            const courseResourceId = {
                userId: authorId,
            };
            const { id: courseId } = yield repository.course.createCourse(courseResourceId, randDTO.course.generateCreateCourseDTO(categoryId));
            const courseLikeResourceId = Object.assign(Object.assign({}, courseResourceId), { courseId });
            const like = yield repository.course.createLike(courseLikeResourceId);
            yield repository.course.deleteLike(like.id, courseLikeResourceId);
            /**
             * Act
             *
             */
            const actual = yield sut.getLikeById(like.id, courseLikeResourceId);
            /**
             * Assert
             *
             */
            expect(actual).toBeNull();
        }));
    });
    describe("getLikeByIdOrThrow", () => {
        it("valid like: should return a like", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const { id: authorId } = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
            yield repository.user.updateUser(authorId, {
                role: course_type_1.UserRoleModel.INSTRUCTOR,
            });
            const { id: categoryId } = yield repository.courseCategory.createCategory({ userId: authorId }, { title: "someTitle" });
            const courseResourceId = {
                userId: authorId,
            };
            const { id: courseId } = yield repository.course.createCourse(courseResourceId, randDTO.course.generateCreateCourseDTO(categoryId));
            const courseLikeResourceId = Object.assign(Object.assign({}, courseResourceId), { courseId });
            const like = yield repository.course.createLike(courseLikeResourceId);
            /**
             * Act
             *
             */
            const actual = yield sut.getLikeByIdOrThrow(like.id, courseLikeResourceId);
            /**
             * Assert
             *
             */
            expect(actual).toBeDefined();
            expect(actual).toEqual(like);
        }));
        it("like doesn't exist, error is specified: should throw the error", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const { id: authorId } = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
            yield repository.user.updateUser(authorId, {
                role: course_type_1.UserRoleModel.INSTRUCTOR,
            });
            const { id: categoryId } = yield repository.courseCategory.createCategory({ userId: authorId }, { title: "someTitle" });
            const courseResourceId = {
                userId: authorId,
            };
            const { id: courseId } = yield repository.course.createCourse(courseResourceId, randDTO.course.generateCreateCourseDTO(categoryId));
            const courseLikeResourceId = Object.assign(Object.assign({}, courseResourceId), { courseId });
            const like = yield repository.course.createLike(courseLikeResourceId);
            const exception = new ClientException_1.default();
            yield repository.course.deleteLike(like.id, courseLikeResourceId);
            try {
                /**
                 * Act
                 *
                 */
                const actual = yield sut.getLikeByIdOrThrow(like.id, courseLikeResourceId, exception);
                fail(Fail.SHOULD_THROW_AN_ERROR);
            }
            catch (error) {
                /**
                 * Assert
                 *
                 */
                expect(exception).toEqual(error);
            }
        }));
        it("like doesn't exist, error is not specified: should throw RecordNotFoundException", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const { id: authorId } = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
            yield repository.user.updateUser(authorId, {
                role: course_type_1.UserRoleModel.INSTRUCTOR,
            });
            const { id: categoryId } = yield repository.courseCategory.createCategory({ userId: authorId }, { title: "someTitle" });
            const courseResourceId = {
                userId: authorId,
            };
            const { id: courseId } = yield repository.course.createCourse(courseResourceId, randDTO.course.generateCreateCourseDTO(categoryId));
            const courseLikeResourceId = Object.assign(Object.assign({}, courseResourceId), { courseId });
            const like = yield repository.course.createLike(courseLikeResourceId);
            yield repository.course.deleteLike(like.id, courseLikeResourceId);
            try {
                /**
                 * Act
                 *
                 */
                const actual = yield sut.getLikeByIdOrThrow(like.id, courseLikeResourceId);
                fail(Fail.SHOULD_THROW_AN_ERROR);
            }
            catch (error) {
                /**
                 * Assert
                 *
                 */
                expect(error).toBeInstanceOf(RecordNotFoundException_1.default);
            }
        }));
    });
    describe("deleteLike", () => {
        it("valid course: should delete the like and return an empty object", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            const { id: authorId } = yield repository.user.createUser(randDTO.user.generateCreateUserDTO(), "", []);
            yield repository.user.updateUser(authorId, {
                role: course_type_1.UserRoleModel.INSTRUCTOR,
            });
            const { id: categoryId } = yield repository.courseCategory.createCategory({ userId: authorId }, { title: "someTitle" });
            const courseResourceId = {
                userId: authorId,
            };
            const { id: courseId } = yield repository.course.createCourse(courseResourceId, randDTO.course.generateCreateCourseDTO(categoryId));
            const courseLikeResourceId = Object.assign(Object.assign({}, courseResourceId), { courseId });
            const { id: likeId } = yield repository.course.createLike(courseLikeResourceId);
            /**
             * Act
             *
             */
            const actual = yield sut.deleteLike(likeId, courseLikeResourceId);
            const deletedLike = yield repository.course.getLikeById(likeId, courseLikeResourceId);
            if (deletedLike) {
                fail(Fail.LIKE_SHOULD_BE_NULL);
            }
            /**
             * Assert
             *
             */
            expect(mockAuthorizeDeleteLike).toBeCalledTimes(1);
            expect(actual).toEqual({});
            expect(deletedLike).toBeNull();
        }));
        it.todo("course doesn't exist");
    });
});
