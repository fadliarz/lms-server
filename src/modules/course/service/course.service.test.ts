import { CourseService, ICourseService } from "./course.service";
import dIContainer from "../../../inversifyConfig";
import {
  CourseDITypes,
  CourseLikeModel,
  CourseLikeResourceId,
  CourseModel,
  CourseResourceId,
  CreateCourseDto,
  GetCourseByIdQuery,
  UpdateBasicCourseDto,
} from "../course.type";
import {
  CourseRepository,
  ICourseRepository,
} from "../repository/course.repository";
import ClientException from "../../../common/class/exceptions/ClientException";

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
  let sut: ICourseService;

  beforeAll(() => {
    dIContainer.unbind(CourseDITypes.REPOSITORY);
    dIContainer
      .bind<ICourseRepository>(CourseDITypes.REPOSITORY)
      .toConstantValue({
        createCourse: mockCreateCourse,
        getCourseById: mockGetCourseById,
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
    dIContainer.unbind(CourseDITypes.REPOSITORY);
    dIContainer
      .bind<ICourseRepository>(CourseDITypes.REPOSITORY)
      .to(CourseRepository);
  });

  beforeEach(() => {
    sut = dIContainer.get<ICourseService>(CourseDITypes.SERVICE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createCourse", () => {
    it("", async () => {
      /**
       * Arrange
       *
       */
      const resourceId = {} as CourseResourceId;
      const dto = {} as CreateCourseDto;
      const createdCourse = { id: 1 } as CourseModel;
      mockCreateCourse.mockReturnValueOnce(createdCourse);
      /**
       * Act
       *
       */
      const actual = await sut.createCourse(resourceId, dto);

      /**
       * Assert
       *
       */
      expect(mockCreateCourse).toBeCalledTimes(1);
      expect(mockCreateCourse).toBeCalledWith(resourceId, dto);
      expect(actual).toEqual(createdCourse);
    });
  });

  describe("getCourseById", () => {
    it("", async () => {
      /**
       * Arrange
       *
       */
      const courseId = 1;
      const resourceId = {} as CourseResourceId;
      const query = {} as GetCourseByIdQuery;
      const course = { id: 1 } as CourseModel;
      mockGetCourseByIdOrThrow.mockReturnValueOnce(course);

      /**
       * Act
       *
       */
      const actual = await sut.getCourseById(courseId, resourceId, query);

      /**
       * Assert
       *
       */
      expect(mockGetCourseByIdOrThrow).toBeCalledTimes(1);
      expect(mockGetCourseByIdOrThrow).toBeCalledWith(
        courseId,
        resourceId,
        query,
        expect.any(Error),
      );
      expect(actual).toEqual(course);
    });
  });

  describe("updateBasicCourse", () => {
    it("", async () => {
      /**
       * Arrange
       *
       */
      const courseId = 1;
      const resourceId = {} as CourseResourceId;
      const dto = {} as UpdateBasicCourseDto;
      const updatedCourse = { id: 1 } as CourseModel;
      mockUpdateBasicCourse.mockReturnValueOnce(updatedCourse);

      /**
       * Act
       *
       */
      const actual = await sut.updateBasicCourse(courseId, resourceId, dto);

      /**
       * Assert
       *
       */
      expect(mockUpdateBasicCourse).toBeCalledTimes(1);
      expect(mockUpdateBasicCourse).toBeCalledWith(courseId, resourceId, dto);
      expect(actual).toEqual(updatedCourse);
    });
  });

  describe("deleteCourse", () => {
    it("", async () => {
      /**
       * Arrange
       *
       */
      const courseId = 1;
      const resourceId = {} as CourseResourceId;
      const deletedCourse = {};
      mockDeleteCourse.mockReturnValueOnce(deletedCourse);

      /**
       * Act
       *
       */
      const actual = await sut.deleteCourse(courseId, resourceId);

      /**
       * Assert
       *
       */
      expect(mockDeleteCourse).toBeCalledTimes(1);
      expect(mockDeleteCourse).toBeCalledWith(courseId, resourceId);
      expect(actual).toEqual(deletedCourse);
    });
  });

  describe("createLike", () => {
    it("", async () => {
      /**
       * Arrange
       *
       */
      const resourceId = {} as CourseLikeResourceId;
      const createdLike = { id: 1 } as CourseLikeModel;
      mockCreateLike.mockReturnValueOnce(createdLike);
      /**
       * Act
       *
       */
      const actual = await sut.createLike(resourceId);

      /**
       * Assert
       *
       */
      expect(mockCreateLike).toBeCalledTimes(1);
      expect(mockCreateLike).toBeCalledWith(resourceId);
      expect(actual).toEqual(createdLike);
    });
  });

  describe("deleteLike", () => {
    it("", async () => {
      /**
       * Arrange
       *
       */
      const likeId = 1;
      const resourceId = {} as CourseLikeResourceId;
      const deletedLike = {};
      mockDeleteLike.mockReturnValueOnce(deletedLike);

      const mockvalidateRelationBetweenResources = jest.fn();
      jest
        .spyOn(CourseService.prototype, "validateRelationBetweenResources")
        .mockImplementationOnce(mockvalidateRelationBetweenResources);

      /**
       * Act
       *
       */
      const actual = await sut.deleteLike(likeId, resourceId);

      /**
       * Assert
       *
       */
      expect(mockDeleteLike).toBeCalledTimes(1);
      expect(mockDeleteLike).toBeCalledWith(likeId, resourceId);
      expect(actual).toEqual(deletedLike);
    });
  });

  describe("validateRelationBetweenResources", () => {
    it("valid relation: should return like", async () => {
      /**
       * Arrange
       *
       */
      const likeId = 1;
      const resourceId: CourseLikeResourceId = {
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
      const actual = await sut.validateRelationBetweenResources({
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
    });

    it("like doesn't exist, error is not specified: should return null", async () => {
      /**
       * Arrange
       *
       */
      const likeId = 1;
      const resourceId = {} as CourseLikeResourceId;
      mockGetLikeById.mockReturnValueOnce(null);

      /**
       * Act
       *
       */
      const actual = await sut.validateRelationBetweenResources({
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
    });

    it("invalid relation, error is not specified: should return null", async () => {
      /**
       * Arrange
       *
       */
      const likeId = 1;
      const resourceId: CourseLikeResourceId = {
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
      const actual = await sut.validateRelationBetweenResources({
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
    });

    it("like doesn't exist, error is specified: should throw the error", async () => {
      /**
       * Arrange
       *
       */
      const likeId = 1;
      const resourceId = {} as CourseLikeResourceId;
      const exception = new ClientException();
      mockGetLikeById.mockReturnValueOnce(null);

      try {
        /**
         * Act
         *
         */
        const actual = await sut.validateRelationBetweenResources(
          {
            likeId,
            resourceId,
          },
          exception,
        );

        fail("Should throw an error");
      } catch (error) {
        expect(exception).toEqual(error);

        /**
         * Assert
         *
         */
        expect(mockGetLikeById).toBeCalledTimes(1);
        expect(mockGetLikeById).toBeCalledWith(likeId, resourceId);
      }
    });
  });
});
