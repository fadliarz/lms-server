import { ICourseRepository } from "./course.repository";
import {
  IRepository,
  RepositoryDITypes,
} from "../../../common/class/repository/repository.type";
import {
  IRandDTO,
  RandDTODITypes,
} from "../../../common/class/rand_dto/rand_dto.type";
import dIContainer from "../../../inversifyConfig";
import {
  CourseDITypes,
  CourseResourceId,
  CreateCourseDto,
  GetCourseByIdQuery,
  ICourseAuthorization,
  UpdateBasicCourseDto,
  UserRoleModel,
} from "../course.type";
import { CourseAuthorization } from "../authorization/course.authorization";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import ClientException from "../../../common/class/exceptions/ClientException";

enum Fail {
  SHOULD_NOT_THROW_AN_ERROR = "Shouldn't throw an error",
  SHOULD_THROW_AN_ERROR = "Should throw an error",
  COURSE_SHOULD_NOT_BE_NULL = "Course should not be null",
  COURSE_SHOULD_BE_NULL = "Course should be null",
  LIKE_SHOULD_NOT_BE_NULL = "Like should not be null",
  LIKE_SHOULD_BE_NULL = "Like should be null",
}

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
  let sut: ICourseRepository;
  let repository: IRepository;
  let randDTO: IRandDTO;

  beforeAll(() => {
    dIContainer.unbind(CourseDITypes.AUTHORIZATION);
    dIContainer
      .bind<ICourseAuthorization>(CourseDITypes.AUTHORIZATION)
      .toConstantValue({
        authorizeCreateCourse: mockAuthorizeCreateCourse,
        authorizeUpdateBasicCourse: mockAuthorizeUpdateBasicCourse,
        authorizeDeleteCourse: mockAuthorizeDeleteCourse,
        authorizeCreateLike: mockAuthorizeCreateLike,
        authorizeDeleteLike: mockAuthorizeDeleteLike,
      });
    repository = dIContainer.get<IRepository>(RepositoryDITypes.FACADE);
    randDTO = dIContainer.get<IRandDTO>(RandDTODITypes.FACADE);
  });

  afterAll(() => {
    dIContainer.unbind(CourseDITypes.AUTHORIZATION);
    dIContainer
      .bind<ICourseAuthorization>(CourseDITypes.AUTHORIZATION)
      .to(CourseAuthorization);
  });

  beforeEach(() => {
    sut = dIContainer.get<ICourseRepository>(CourseDITypes.REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createCourse", () => {
    it("valid dto: should create a course and return the course", async () => {
      /**
       * Arrange
       *
       */
      const { id: authorId } = await repository.user.createUser(
        randDTO.user.generateCreateUserDTO(),
        "",
        [],
      );
      await repository.user.unauthorizedUpdateUser(authorId, {
        role: UserRoleModel.INSTRUCTOR,
      });
      const { id: categoryId } = await repository.courseCategory.createCategory(
        { userId: authorId },
        { title: "someTitle" },
      );
      const courseResourceId: CourseResourceId = {
        userId: authorId,
      };
      const dto: CreateCourseDto =
        await randDTO.course.generateCreateCourseDTO(categoryId);

      /**
       * Act
       *
       */
      const actual = await sut.createCourse(courseResourceId, dto);
      const createdCourse = await repository.course.getCourseById(
        actual.id,
        courseResourceId,
        {} as any,
      );

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
    });
  });

  describe("getCourseById", () => {
    it("valid course: should return a course", async () => {
      /**
       * Arrange
       *
       */
      const { id: authorId } = await repository.user.createUser(
        randDTO.user.generateCreateUserDTO(),
        "",
        [],
      );
      await repository.user.unauthorizedUpdateUser(authorId, {
        role: UserRoleModel.INSTRUCTOR,
      });
      const { id: categoryId } = await repository.courseCategory.createCategory(
        { userId: authorId },
        { title: "someTitle" },
      );
      const courseResourceId: CourseResourceId = {
        userId: authorId,
      };
      const course = await repository.course.createCourse(
        courseResourceId,
        randDTO.course.generateCreateCourseDTO(categoryId),
      );

      /**
       * Act
       *
       */
      const actual = await sut.getCourseById(
        course.id,
        courseResourceId,
        {} as GetCourseByIdQuery,
      );

      /**
       * Arrange
       *
       */
      expect(actual).toBeDefined();
      expect(course).toBeDefined();
      expect(course).toEqual(actual);
    });

    it("course doesn't exist: should return null", async () => {
      /**
       * Arrange
       *
       */
      const { id: authorId } = await repository.user.createUser(
        randDTO.user.generateCreateUserDTO(),
        "",
        [],
      );
      await repository.user.unauthorizedUpdateUser(authorId, {
        role: UserRoleModel.INSTRUCTOR,
      });
      const { id: categoryId } = await repository.courseCategory.createCategory(
        { userId: authorId },
        { title: "someTitle" },
      );
      const courseResourceId: CourseResourceId = {
        userId: authorId,
      };
      const course = await repository.course.createCourse(
        courseResourceId,
        randDTO.course.generateCreateCourseDTO(categoryId),
      );

      await repository.course.deleteCourse(course.id, courseResourceId);

      /**
       * Act
       *
       */
      const actual = await sut.getCourseById(
        course.id,
        courseResourceId,
        {} as GetCourseByIdQuery,
      );

      /**
       * Arrange
       *
       */
      expect(actual).toBeNull();
    });

    it("valid course and query: should return a course and its author & category ", async () => {
      /**
       * Arrange
       *
       */
      const { id: authorId } = await repository.user.createUser(
        randDTO.user.generateCreateUserDTO(),
        "",
        [],
      );
      await repository.user.unauthorizedUpdateUser(authorId, {
        role: UserRoleModel.INSTRUCTOR,
      });
      const category = await repository.courseCategory.createCategory(
        { userId: authorId },
        { title: "someTitle" },
      );
      const courseResourceId: CourseResourceId = {
        userId: authorId,
      };
      const course = await repository.course.createCourse(
        courseResourceId,
        randDTO.course.generateCreateCourseDTO(category.id),
      );

      /**
       * Act
       *
       */
      const actual = await sut.getCourseById(course.id, courseResourceId, {
        include_author: true,
        include_category: true,
      } as GetCourseByIdQuery);

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
      expect({
        ...course,
        category: undefined,
        author: undefined,
      }).toEqual({
        ...actual,
        category: undefined,
        author: undefined,
      });
      expect(authorId).toEqual(actual?.author?.id);
      expect(category).toEqual(actual.category);
    });
  });

  describe("getCourseByIdOrThrow", () => {
    it("valid course: should return a course", async () => {
      /**
       * Arrange
       *
       */
      const { id: authorId } = await repository.user.createUser(
        randDTO.user.generateCreateUserDTO(),
        "",
        [],
      );
      await repository.user.unauthorizedUpdateUser(authorId, {
        role: UserRoleModel.INSTRUCTOR,
      });
      const { id: categoryId } = await repository.courseCategory.createCategory(
        { userId: authorId },
        { title: "someTitle" },
      );
      const courseResourceId: CourseResourceId = {
        userId: authorId,
      };
      const course = await repository.course.createCourse(
        courseResourceId,
        randDTO.course.generateCreateCourseDTO(categoryId),
      );

      /**
       * Act
       *
       */
      const actual = await sut.getCourseByIdOrThrow(
        course.id,
        courseResourceId,
        {} as GetCourseByIdQuery,
      );

      /**
       * Arrange
       *
       */
      expect(actual).toBeDefined();
      expect(course).toBeDefined();
      expect(course).toEqual(actual);
    });

    it("course doesn't exist, error is specified: should throw the error ", async () => {
      /**
       * Arrange
       *
       */
      const { id: authorId } = await repository.user.createUser(
        randDTO.user.generateCreateUserDTO(),
        "",
        [],
      );
      await repository.user.unauthorizedUpdateUser(authorId, {
        role: UserRoleModel.INSTRUCTOR,
      });
      const { id: categoryId } = await repository.courseCategory.createCategory(
        { userId: authorId },
        { title: "someTitle" },
      );
      const courseResourceId: CourseResourceId = {
        userId: authorId,
      };
      const course = await sut.createCourse(
        courseResourceId,
        randDTO.course.generateCreateCourseDTO(categoryId),
      );
      const exception = new RecordNotFoundException();

      await repository.course.deleteCourse(course.id, courseResourceId);

      try {
        /**
         * Act
         *
         */
        const actual = await sut.getCourseByIdOrThrow(
          course.id,
          courseResourceId,
          {} as GetCourseByIdQuery,
          exception,
        );

        fail(Fail.SHOULD_THROW_AN_ERROR);
      } catch (error) {
        /**
         * Arrange
         *
         */
        expect(exception).toEqual(error);
      }
    });

    it("course doesn't exist, error is not specified, should throw RecordNotFoundException", async () => {
      /**
       * Arrange
       *
       */
      const { id: authorId } = await repository.user.createUser(
        randDTO.user.generateCreateUserDTO(),
        "",
        [],
      );
      await repository.user.unauthorizedUpdateUser(authorId, {
        role: UserRoleModel.INSTRUCTOR,
      });
      const { id: categoryId } = await repository.courseCategory.createCategory(
        { userId: authorId },
        { title: "someTitle" },
      );
      const courseResourceId: CourseResourceId = {
        userId: authorId,
      };
      const course = await sut.createCourse(
        courseResourceId,
        randDTO.course.generateCreateCourseDTO(categoryId),
      );

      await repository.course.deleteCourse(course.id, courseResourceId);

      try {
        /**
         * Act
         *
         */
        const actual = await sut.getCourseByIdOrThrow(
          course.id,
          courseResourceId,
          {} as GetCourseByIdQuery,
        );

        fail(Fail.SHOULD_THROW_AN_ERROR);
      } catch (error) {
        /**
         * Arrange
         *
         */
        expect(error).toBeInstanceOf(RecordNotFoundException);
      }
    });
  });

  describe("updateBasicCourse", () => {
    it("valid course: should update the course and return the updated course", async () => {
      /**
       * Arrange
       *
       */
      const { id: authorId } = await repository.user.createUser(
        randDTO.user.generateCreateUserDTO(),
        "",
        [],
      );
      await repository.user.unauthorizedUpdateUser(authorId, {
        role: UserRoleModel.INSTRUCTOR,
      });
      const { id: categoryId } = await repository.courseCategory.createCategory(
        { userId: authorId },
        { title: "someTitle" },
      );
      const courseResourceId: CourseResourceId = {
        userId: authorId,
      };
      const course = await repository.course.createCourse(
        courseResourceId,
        randDTO.course.generateCreateCourseDTO(categoryId),
      );
      const dto: UpdateBasicCourseDto = {
        image: "modified".concat(course.image),
        title: "modified".concat(course.title),
      };

      /**
       * Act
       *
       */
      const actual = await sut.updateBasicCourse(
        course.id,
        courseResourceId,
        dto,
      );

      /**
       * Arrange
       *
       */
      expect(mockAuthorizeUpdateBasicCourse).toBeCalledTimes(1);

      expect(actual).toBeDefined();
      expect(course).toBeDefined();
      expect(course.image).not.toEqual(actual.image);
      expect(course.title).not.toEqual(actual.title);
      expect({
        ...course,
        image: undefined,
        title: undefined,
        updatedAt: undefined,
      }).toEqual({
        ...actual,
        image: undefined,
        title: undefined,
        updatedAt: undefined,
      });
    });

    it.todo("course doesn't exist");
  });

  describe("updateCourse", () => {
    it("valid course: should update the course and return the updated course", async () => {
      /**
       * Arrange
       *
       */
      const { id: authorId } = await repository.user.createUser(
        randDTO.user.generateCreateUserDTO(),
        "",
        [],
      );
      await repository.user.unauthorizedUpdateUser(authorId, {
        role: UserRoleModel.INSTRUCTOR,
      });
      const { id: categoryId } = await repository.courseCategory.createCategory(
        { userId: authorId },
        { title: "someTitle" },
      );
      const courseResourceId: CourseResourceId = {
        userId: authorId,
      };
      const course = await repository.course.createCourse(
        courseResourceId,
        randDTO.course.generateCreateCourseDTO(categoryId),
      );
      const dto: UpdateBasicCourseDto = {
        image: "modified".concat(course.image),
        title: "modified".concat(course.title),
      };

      /**
       * Act
       *
       */
      const actual = await sut.updateCourse(course.id, courseResourceId, dto);

      /**
       * Arrange
       *
       */
      expect(mockAuthorizeUpdateBasicCourse).toBeCalledTimes(1);

      expect(actual).toBeDefined();
      expect(course).toBeDefined();
      expect(course.image).not.toEqual(actual.image);
      expect(course.title).not.toEqual(actual.title);
      expect({
        ...course,
        image: undefined,
        title: undefined,
        updatedAt: undefined,
      }).toEqual({
        ...actual,
        image: undefined,
        title: undefined,
        updatedAt: undefined,
      });
    });

    it.todo("course doesn't exist");
  });

  describe("deleteCourse", () => {
    it("valid course: should delete the course and return an empty object", async () => {
      /**
       * Arrange
       *
       */
      const { id: authorId } = await repository.user.createUser(
        randDTO.user.generateCreateUserDTO(),
        "",
        [],
      );
      await repository.user.unauthorizedUpdateUser(authorId, {
        role: UserRoleModel.INSTRUCTOR,
      });
      const { id: categoryId } = await repository.courseCategory.createCategory(
        { userId: authorId },
        { title: "someTitle" },
      );
      const courseResourceId: CourseResourceId = {
        userId: authorId,
      };
      const dto: CreateCourseDto =
        await randDTO.course.generateCreateCourseDTO(categoryId);
      const { id: courseId } = await repository.course.createCourse(
        courseResourceId,
        dto,
      );

      /**
       * Act
       *
       */
      const actual = await sut.deleteCourse(courseId, courseResourceId);
      const deletedCourse = await repository.course.getCourseById(
        courseId,
        courseResourceId,
        {} as GetCourseByIdQuery,
      );

      /**
       * Assert
       *
       */
      expect(mockAuthorizeDeleteCourse).toBeCalledTimes(1);

      expect(actual).toEqual({});
      expect(deletedCourse).toBeNull();
    });
  });

  describe("createLike", () => {
    it("valid dto: should create a like and return the like", async () => {
      /**
       * Arrange
       *
       */
      const { id: authorId } = await repository.user.createUser(
        randDTO.user.generateCreateUserDTO(),
        "",
        [],
      );
      await repository.user.unauthorizedUpdateUser(authorId, {
        role: UserRoleModel.INSTRUCTOR,
      });
      const { id: categoryId } = await repository.courseCategory.createCategory(
        { userId: authorId },
        { title: "someTitle" },
      );
      const courseResourceId: CourseResourceId = {
        userId: authorId,
      };
      const { id: courseId } = await repository.course.createCourse(
        courseResourceId,
        randDTO.course.generateCreateCourseDTO(categoryId),
      );
      const courseLikeResourceId = {
        ...courseResourceId,
        courseId,
      };

      /**
       * Act
       *
       */
      const actual = await sut.createLike(courseLikeResourceId);
      const createdLike = await repository.course.getLikeById(
        actual.id,
        courseLikeResourceId,
      );

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
    });

    it.todo("course doesn't exist");
  });

  describe("getLikeById", () => {
    it("valid like: should return a like", async () => {
      /**
       * Arrange
       *
       */
      const { id: authorId } = await repository.user.createUser(
        randDTO.user.generateCreateUserDTO(),
        "",
        [],
      );
      await repository.user.unauthorizedUpdateUser(authorId, {
        role: UserRoleModel.INSTRUCTOR,
      });
      const { id: categoryId } = await repository.courseCategory.createCategory(
        { userId: authorId },
        { title: "someTitle" },
      );
      const courseResourceId: CourseResourceId = {
        userId: authorId,
      };
      const { id: courseId } = await repository.course.createCourse(
        courseResourceId,
        randDTO.course.generateCreateCourseDTO(categoryId),
      );
      const courseLikeResourceId = {
        ...courseResourceId,
        courseId,
      };
      const like = await repository.course.createLike(courseLikeResourceId);

      /**
       * Act
       *
       */
      const actual = await sut.getLikeById(like.id, courseLikeResourceId);

      /**
       * Assert
       *
       */
      expect(actual).toBeDefined();
      expect(actual).toEqual(like);
    });

    it("like doesn't exist: should return null", async () => {
      /**
       * Arrange
       *
       */
      const { id: authorId } = await repository.user.createUser(
        randDTO.user.generateCreateUserDTO(),
        "",
        [],
      );
      await repository.user.unauthorizedUpdateUser(authorId, {
        role: UserRoleModel.INSTRUCTOR,
      });
      const { id: categoryId } = await repository.courseCategory.createCategory(
        { userId: authorId },
        { title: "someTitle" },
      );
      const courseResourceId: CourseResourceId = {
        userId: authorId,
      };
      const { id: courseId } = await repository.course.createCourse(
        courseResourceId,
        randDTO.course.generateCreateCourseDTO(categoryId),
      );
      const courseLikeResourceId = {
        ...courseResourceId,
        courseId,
      };
      const like = await repository.course.createLike(courseLikeResourceId);

      await repository.course.deleteLike(like.id, courseLikeResourceId);

      /**
       * Act
       *
       */
      const actual = await sut.getLikeById(like.id, courseLikeResourceId);

      /**
       * Assert
       *
       */
      expect(actual).toBeNull();
    });
  });

  describe("getLikeByIdOrThrow", () => {
    it("valid like: should return a like", async () => {
      /**
       * Arrange
       *
       */
      const { id: authorId } = await repository.user.createUser(
        randDTO.user.generateCreateUserDTO(),
        "",
        [],
      );
      await repository.user.unauthorizedUpdateUser(authorId, {
        role: UserRoleModel.INSTRUCTOR,
      });
      const { id: categoryId } = await repository.courseCategory.createCategory(
        { userId: authorId },
        { title: "someTitle" },
      );
      const courseResourceId: CourseResourceId = {
        userId: authorId,
      };
      const { id: courseId } = await repository.course.createCourse(
        courseResourceId,
        randDTO.course.generateCreateCourseDTO(categoryId),
      );
      const courseLikeResourceId = {
        ...courseResourceId,
        courseId,
      };
      const like = await repository.course.createLike(courseLikeResourceId);

      /**
       * Act
       *
       */
      const actual = await sut.getLikeByIdOrThrow(
        like.id,
        courseLikeResourceId,
      );

      /**
       * Assert
       *
       */
      expect(actual).toBeDefined();
      expect(actual).toEqual(like);
    });

    it("like doesn't exist, error is specified: should throw the error", async () => {
      /**
       * Arrange
       *
       */
      const { id: authorId } = await repository.user.createUser(
        randDTO.user.generateCreateUserDTO(),
        "",
        [],
      );
      await repository.user.unauthorizedUpdateUser(authorId, {
        role: UserRoleModel.INSTRUCTOR,
      });
      const { id: categoryId } = await repository.courseCategory.createCategory(
        { userId: authorId },
        { title: "someTitle" },
      );
      const courseResourceId: CourseResourceId = {
        userId: authorId,
      };
      const { id: courseId } = await repository.course.createCourse(
        courseResourceId,
        randDTO.course.generateCreateCourseDTO(categoryId),
      );
      const courseLikeResourceId = {
        ...courseResourceId,
        courseId,
      };
      const like = await repository.course.createLike(courseLikeResourceId);
      const exception = new ClientException();

      await repository.course.deleteLike(like.id, courseLikeResourceId);

      try {
        /**
         * Act
         *
         */
        const actual = await sut.getLikeByIdOrThrow(
          like.id,
          courseLikeResourceId,
          exception,
        );

        fail(Fail.SHOULD_THROW_AN_ERROR);
      } catch (error) {
        /**
         * Assert
         *
         */
        expect(exception).toEqual(error);
      }
    });

    it("like doesn't exist, error is not specified: should throw RecordNotFoundException", async () => {
      /**
       * Arrange
       *
       */
      const { id: authorId } = await repository.user.createUser(
        randDTO.user.generateCreateUserDTO(),
        "",
        [],
      );
      await repository.user.unauthorizedUpdateUser(authorId, {
        role: UserRoleModel.INSTRUCTOR,
      });
      const { id: categoryId } = await repository.courseCategory.createCategory(
        { userId: authorId },
        { title: "someTitle" },
      );
      const courseResourceId: CourseResourceId = {
        userId: authorId,
      };
      const { id: courseId } = await repository.course.createCourse(
        courseResourceId,
        randDTO.course.generateCreateCourseDTO(categoryId),
      );
      const courseLikeResourceId = {
        ...courseResourceId,
        courseId,
      };
      const like = await repository.course.createLike(courseLikeResourceId);

      await repository.course.deleteLike(like.id, courseLikeResourceId);

      try {
        /**
         * Act
         *
         */
        const actual = await sut.getLikeByIdOrThrow(
          like.id,
          courseLikeResourceId,
        );

        fail(Fail.SHOULD_THROW_AN_ERROR);
      } catch (error) {
        /**
         * Assert
         *
         */
        expect(error).toBeInstanceOf(RecordNotFoundException);
      }
    });
  });

  describe("deleteLike", () => {
    it("valid course: should delete the like and return an empty object", async () => {
      /**
       * Arrange
       *
       */
      const { id: authorId } = await repository.user.createUser(
        randDTO.user.generateCreateUserDTO(),
        "",
        [],
      );
      await repository.user.unauthorizedUpdateUser(authorId, {
        role: UserRoleModel.INSTRUCTOR,
      });
      const { id: categoryId } = await repository.courseCategory.createCategory(
        { userId: authorId },
        { title: "someTitle" },
      );
      const courseResourceId: CourseResourceId = {
        userId: authorId,
      };
      const { id: courseId } = await repository.course.createCourse(
        courseResourceId,
        randDTO.course.generateCreateCourseDTO(categoryId),
      );
      const courseLikeResourceId = {
        ...courseResourceId,
        courseId,
      };
      const { id: likeId } =
        await repository.course.createLike(courseLikeResourceId);

      /**
       * Act
       *
       */
      const actual = await sut.deleteLike(likeId, courseLikeResourceId);
      const deletedLike = await repository.course.getLikeById(
        likeId,
        courseLikeResourceId,
      );

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
    });

    it.todo("course doesn't exist");
  });
});
