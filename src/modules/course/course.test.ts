import "reflect-metadata";

import { Request, Response, NextFunction, response } from "express";
import { StatusCode } from "../../common/constants/statusCode";
import {
  CourseDITypes,
  CourseModel,
  CreateCourseDto,
  GetCourseByIdResBody,
  GetCourseByIdQuery,
  BasicCategory,
  BasicUser,
  UpdateCourseDto,
  CreateCourseLikeDto,
  CourseLikeResourceId,
} from "./course.type";
import { CourseCategoryModel } from "../category/category.type";
import dIContainer from "../../inversifyConfig";
import { ICourseController } from "./controller/course.controller";
import { generateRandomCreateCourseDto } from "../../common/functions/random/random";
import errorMiddleware from "../../middlewares/errorMiddleware";
import { UserModel } from "../user/user.type";
import RandPrisma from "../../common/class/randprisma/RandPrisma";
import { CourseStatus, Prisma, PrismaClient, Role } from "@prisma/client";
import { CourseService } from "./service/course.service";
import PrismaClientSingleton from "../../common/class/PrismaClientSingleton";
import { ErrorCode } from "../../common/constants/errorCode";
import HttpException from "../../common/exceptions/HttpException";

/**
 *
 * This is an integration test file for:
 * 1. Controller
 * 2. Service
 * 3. Repository
 *
 */

/**
 *
 * @param mockRequest
 * @param mockResponse
 * @param next
 *
 * Mock next() function so it can simulates real wold scenario.
 */
function mockNextError(
  mockRequest: Request,
  mockResponse: Response,
  next: NextFunction
): void {
  (next as jest.Mock).mockImplementation((error: Error) => {
    errorMiddleware(error, mockRequest, mockResponse, next);
  });
}

describe("", () => {
  let controller: ICourseController;
  let prisma: PrismaClient;
  let randPrisma: RandPrisma;
  let mockRequest: Request;
  let mockResponse: Response;
  let next: NextFunction;

  beforeAll(async () => {
    controller = dIContainer.get<ICourseController>(CourseDITypes.CONTROLLER);
    prisma = PrismaClientSingleton.getInstance();
    randPrisma = new RandPrisma();
  });

  beforeEach(() => {
    mockRequest = {} as Request;
    mockResponse = {
      status: jest.fn(() => mockResponse),
      json: jest.fn(),
    } as any as Response;
    next = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("Course", () => {
    describe("CreateCourse", () => {
      let user: UserModel;
      let category: CourseCategoryModel;
      let bodyTemplate: CreateCourseDto;

      function bodyMatchCourse(
        courseDto: CreateCourseDto,
        createdCourse: CourseModel
      ) {
        expect(courseDto.title).toEqual(createdCourse.title);
        expect(courseDto.categoryId).toEqual(createdCourse.categoryId);
        expect(courseDto.description).toEqual(createdCourse.description);
        expect(
          courseDto.image ||
            "https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg"
        ).toEqual(createdCourse.image);
        expect(courseDto.material).toEqual(createdCourse.material);
      }

      type TestCase = {
        name: string;
        modifyBody: (bodyTemplate: CreateCourseDto) => Partial<CreateCourseDto>;
        test: (
          mockRequest: Request,
          mockResponse: Response,
          next: NextFunction
        ) => void;
      };

      const testCases: TestCase[] = [
        {
          name: "OK: Complete Body",
          modifyBody: (
            bodyTemplate: CreateCourseDto
          ): Partial<CreateCourseDto> => {
            return {
              ...bodyTemplate,
            };
          },
          test: async (mockRequest, mockResponse, next) => {
            const spyOnCreateCourseService = jest.spyOn(
              CourseService.prototype,
              "createCourse"
            );

            await controller.createCourse(mockRequest, mockResponse, next);

            expect(spyOnCreateCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnCreateCourseService).toHaveBeenCalledWith(
              (mockRequest as any).user.id,
              mockRequest.body
            );
            const newCourseFromService = (await spyOnCreateCourseService.mock
              .results[0].value) satisfies CourseModel;

            bodyMatchCourse(mockRequest.body, newCourseFromService);

            expect(next).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.RESOURCE_CREATED
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: newCourseFromService,
            });
          },
        },
        {
          name: "OK: Missing image",
          modifyBody: (
            bodyTemplate: CreateCourseDto
          ): Partial<CreateCourseDto> => {
            return {
              ...bodyTemplate,
              image: undefined,
            };
          },
          test: async (mockRequest, mockResponse, next) => {
            const spyOnCreateCourseService = jest.spyOn(
              CourseService.prototype,
              "createCourse"
            );

            await controller.createCourse(mockRequest, mockResponse, next);

            expect(spyOnCreateCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnCreateCourseService).toHaveBeenCalledWith(
              (mockRequest as any).user.id,
              mockRequest.body
            );
            const newCourseFromService = await spyOnCreateCourseService.mock
              .results[0].value;

            bodyMatchCourse(mockRequest.body, newCourseFromService);

            expect(next).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.RESOURCE_CREATED
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: newCourseFromService,
            });
          },
        },
        {
          name: "OK: Missing description",
          modifyBody: (
            bodyTemplate: CreateCourseDto
          ): Partial<CreateCourseDto> => {
            return {
              ...bodyTemplate,
              description: undefined,
            };
          },
          test: async (mockRequest, mockResponse, next) => {
            const spyOnCreateCourseService = jest.spyOn(
              CourseService.prototype,
              "createCourse"
            );

            await controller.createCourse(mockRequest, mockResponse, next);

            expect(spyOnCreateCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnCreateCourseService).toHaveBeenCalledWith(
              (mockRequest as any).user.id,
              mockRequest.body
            );
            const newCourseFromService = await spyOnCreateCourseService.mock
              .results[0].value;

            bodyMatchCourse(mockRequest.body, newCourseFromService);

            expect(next).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.RESOURCE_CREATED
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: newCourseFromService,
            });
          },
        },
        {
          name: "OK: Missing material",
          modifyBody: (
            bodyTemplate: CreateCourseDto
          ): Partial<CreateCourseDto> => {
            return {
              ...bodyTemplate,
              material: undefined,
            };
          },
          test: async (mockRequest, mockResponse, next) => {
            const spyOnCreateCourseService = jest.spyOn(
              CourseService.prototype,
              "createCourse"
            );

            await controller.createCourse(mockRequest, mockResponse, next);

            expect(spyOnCreateCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnCreateCourseService).toHaveBeenCalledWith(
              (mockRequest as any).user.id,
              mockRequest.body
            );
            const newCourseFromService = await spyOnCreateCourseService.mock
              .results[0].value;

            bodyMatchCourse(mockRequest.body, newCourseFromService);

            expect(next).not.toHaveBeenCalled();

            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.RESOURCE_CREATED
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: newCourseFromService,
            });
          },
        },
        {
          name: "BadRequest: Missing title",
          modifyBody: (
            bodyTemplate: CreateCourseDto
          ): Partial<CreateCourseDto> => {
            return {
              ...bodyTemplate,
              title: undefined,
            };
          },
          test: async (
            mockRequest: Request,
            mockResponse: Response,
            next: NextFunction
          ) => {
            const spyOnCreateCourseService = jest.spyOn(
              CourseService.prototype,
              "createCourse"
            );

            mockNextError(mockRequest, mockResponse, next);
            await controller.createCourse(mockRequest, mockResponse, next);

            expect(spyOnCreateCourseService).not.toHaveBeenCalled();

            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(expect.any(HttpException));
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.BAD_REQUEST
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              error: {
                errorCode: ErrorCode.INVALID_BODY,
                message: expect.any(String) || expect.any(Array<String>),
              },
            });
          },
        },
        {
          name: "BadRequest: Missing categoryId",
          modifyBody: (
            bodyTemplate: CreateCourseDto
          ): Partial<CreateCourseDto> => {
            return {
              ...bodyTemplate,
              categoryId: undefined,
            };
          },
          test: async (
            mockRequest: Request,
            mockResponse: Response,
            next: NextFunction
          ) => {
            const spyOnCreateCourseService = jest.spyOn(
              CourseService.prototype,
              "createCourse"
            );

            mockNextError(mockRequest, mockResponse, next);
            await controller.createCourse(mockRequest, mockResponse, next);

            expect(spyOnCreateCourseService).not.toHaveBeenCalled();

            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(expect.any(HttpException));
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.BAD_REQUEST
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              error: {
                errorCode: ErrorCode.INVALID_BODY,
                message: expect.any(String) || expect.any(Array<String>),
              },
            });
          },
        },
      ];

      testCases.forEach((tc) => {
        return it(tc.name, async () => {
          user = await randPrisma.generateUser(Role.OWNER);
          (mockRequest as any).user = user;

          category = await randPrisma.generateCategory();
          bodyTemplate = generateRandomCreateCourseDto(category.id);
          mockRequest.body = tc.modifyBody(bodyTemplate);

          await tc.test(mockRequest, mockResponse, next);
        });
      });
    });

    // TODO : check again
    describe("GetCourseById", () => {
      function bodyMatchCourse(
        responseCourse: GetCourseByIdResBody,
        course: CourseModel
      ) {
        expect(responseCourse.title).toEqual(course.title);
        expect(responseCourse.categoryId).toEqual(course.categoryId);
        expect(responseCourse.description).toEqual(course.description);
        expect(
          responseCourse.image ||
            "https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg"
        ).toEqual(course.image);
        expect(responseCourse.material).toEqual(course.material);
      }

      function bodyMatchAuthor(responseAuthor: BasicUser, author: UserModel) {
        expect(author.id).not.toBeUndefined();
        expect(author.name).not.toBeUndefined();
        expect(author.NIM).not.toBeUndefined();
        expect(author.avatar).not.toBeUndefined();

        expect(responseAuthor.id).toEqual(author.id);
        expect(responseAuthor.name).toEqual(author.name);
        expect(responseAuthor.NIM).toEqual(author.NIM);
        expect(responseAuthor.avatar).toEqual(author.avatar);
      }

      function bodyMatchCategory(
        responseCategory: BasicCategory,
        category: CourseCategoryModel
      ) {
        expect(category.id).not.toBeUndefined();
        expect(category.title).not.toBeUndefined();

        expect(responseCategory.id).toEqual(category.id);
        expect(responseCategory.title).toEqual(category.title);
      }

      function bodyCheckStudents(studentsFromBody: BasicUser) {}

      function bodyCheckInstructors(body: GetCourseByIdResBody) {}

      function bodyCheckPlaylist(body: GetCourseByIdResBody) {}

      type TestParams = {
        mockRequest: Request;
        mockResponse: Response;
        next: NextFunction;
        author: UserModel;
        category: CourseCategoryModel;
        course: CourseModel;
      };
      type TestCase = {
        name: string;
        modifyQuery: (
          queryTemplate: GetCourseByIdQuery
        ) => Partial<GetCourseByIdQuery>;
        test: (params: TestParams) => Promise<void>;
      };

      const testCases: TestCase[] = [
        {
          name: "OK: No Query",
          modifyQuery: (
            queryTemplate: GetCourseByIdQuery
          ): Partial<GetCourseByIdQuery> => {
            return {
              ...queryTemplate,
            };
          },
          test: async (params: TestParams) => {
            const {
              mockRequest,
              mockResponse,
              next,
              author,
              category,
              course,
            } = params;
            const spyOnGetCourseByIdService = jest.spyOn(
              CourseService.prototype,
              "getCourseById"
            );
            await controller.getCourseById(mockRequest, mockResponse, next);

            expect(spyOnGetCourseByIdService).toHaveBeenCalledTimes(1);
            expect(spyOnGetCourseByIdService).toHaveBeenCalledWith(
              (mockRequest as any).params.courseId,
              (mockRequest as any).query
            );

            const responseCourse: GetCourseByIdResBody =
              await spyOnGetCourseByIdService.mock.results[0].value;
            bodyMatchCourse(responseCourse, course);
            expect(responseCourse.author).toBe(undefined);
            expect(responseCourse.students).toBe(undefined);
            expect(responseCourse.instructors).toBe(undefined);
            expect(responseCourse.category).toBe(undefined);
            expect(responseCourse.playlist).toBe(undefined);

            expect(next).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.SUCCESS
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: responseCourse,
            });
          },
        },
        {
          name: "OK: Include Author",
          modifyQuery: (
            queryTemplate: GetCourseByIdQuery
          ): Partial<GetCourseByIdQuery> => {
            return {
              ...queryTemplate,
              include_author: true,
            };
          },
          test: async (params: TestParams) => {
            const {
              mockRequest,
              mockResponse,
              next,
              author,
              category,
              course,
            } = params;
            const spyOnGetCourseByIdService = jest.spyOn(
              CourseService.prototype,
              "getCourseById"
            );
            await controller.getCourseById(mockRequest, mockResponse, next);

            expect(spyOnGetCourseByIdService).toHaveBeenCalledTimes(1);
            expect(spyOnGetCourseByIdService).toHaveBeenCalledWith(
              (mockRequest as any).params.courseId,
              (mockRequest as any).query
            );

            const responseCourse: GetCourseByIdResBody =
              await spyOnGetCourseByIdService.mock.results[0].value;
            bodyMatchCourse(responseCourse, course);
            expect(responseCourse.author).not.toBe(undefined);
            bodyMatchAuthor(responseCourse.author as BasicUser, author);
            expect(responseCourse.students).toBe(undefined);
            expect(responseCourse.instructors).toBe(undefined);
            expect(responseCourse.category).toBe(undefined);
            expect(responseCourse.playlist).toBe(undefined);

            expect(next).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.SUCCESS
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: responseCourse,
            });
          },
        },
        {
          name: "OK: Include Category",
          modifyQuery: (
            queryTemplate: GetCourseByIdQuery
          ): Partial<GetCourseByIdQuery> => {
            return {
              ...queryTemplate,
              include_category: true,
            };
          },
          test: async (params: TestParams) => {
            const {
              mockRequest,
              mockResponse,
              next,
              author,
              category,
              course,
            } = params;
            const spyOnGetCourseByIdService = jest.spyOn(
              CourseService.prototype,
              "getCourseById"
            );
            await controller.getCourseById(mockRequest, mockResponse, next);

            expect(spyOnGetCourseByIdService).toHaveBeenCalledTimes(1);
            expect(spyOnGetCourseByIdService).toHaveBeenCalledWith(
              (mockRequest as any).params.courseId,
              (mockRequest as any).query
            );

            const responseCourse: GetCourseByIdResBody =
              await spyOnGetCourseByIdService.mock.results[0].value;
            bodyMatchCourse(responseCourse, course);
            expect(responseCourse.author).toBe(undefined);
            expect(responseCourse.students).toBe(undefined);
            expect(responseCourse.instructors).toBe(undefined);
            expect(responseCourse.category).not.toBe(undefined);
            bodyMatchCategory(
              responseCourse.category as BasicCategory,
              category
            );
            expect(responseCourse.playlist).toBe(undefined);

            expect(next).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.SUCCESS
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: responseCourse,
            });
          },
        },
      ];

      testCases.forEach((tc) => {
        return it(tc.name, async () => {
          const queryTemplate: GetCourseByIdQuery = {};
          const { author, category, course } =
            await randPrisma.generateCourse();
          (mockRequest as any).params = { courseId: course.id };
          (mockRequest as any).query = tc.modifyQuery(queryTemplate);

          await tc.test({
            mockRequest,
            mockResponse,
            next,
            author,
            category,
            course,
          });
        });
      });
    });

    describe("UpdateCourse", () => {
      let user: UserModel;

      function bodyMatchCourse(
        updatedCourse: CourseModel,
        updateDto: UpdateCourseDto,
        oldCourse: CourseModel
      ) {
        expect(updatedCourse).toBeDefined();
        expect(oldCourse).toBeDefined();

        updateDto.title
          ? expect(updatedCourse.title).not.toEqual(oldCourse.title)
          : expect(updatedCourse.title).toEqual(oldCourse.title);
        updateDto.categoryId
          ? expect(updatedCourse.categoryId).not.toEqual(oldCourse.categoryId)
          : expect(updatedCourse.categoryId).toEqual(oldCourse.categoryId);
        updateDto.image
          ? expect(updatedCourse.image).not.toEqual(oldCourse.image)
          : expect(updatedCourse.image).toEqual(oldCourse.image);
        updateDto.description
          ? expect(updatedCourse.description).not.toEqual(oldCourse.description)
          : expect(updatedCourse.description).toEqual(oldCourse.description);
        updateDto.material
          ? expect(updatedCourse.material).not.toEqual(oldCourse.material)
          : expect(updatedCourse.material).toEqual(oldCourse.material);
        updateDto.status
          ? expect(updatedCourse.status).not.toEqual(oldCourse.status)
          : expect(updatedCourse.status).toEqual(oldCourse.status);

        expect(updatedCourse.id).toEqual(oldCourse.id);

        // TODO: validate more field
      }

      type TestParams = {
        mockRequest: Request;
        mockResponse: Response;
        next: NextFunction;
        course: CourseModel;
      };
      type TestCase = {
        name: string;
        generateBody: (
          course: CourseModel
        ) => Promise<Partial<UpdateCourseDto>>;
        test: (testParams: TestParams) => void;
      };

      /**
       *
       * 1. No update
       * 2. Missing field
       * 3. Non-existent course
       * 4. Invalid field (foreign constraint, etc)
       *
       */
      const testCases: TestCase[] = [
        {
          name: "OK: No Update",
          generateBody: async (course: CourseModel) => {
            const bodyTemplate: UpdateCourseDto = {};
            const modifiedBody: UpdateCourseDto = {
              title: bodyTemplate.title
                ? course.title.concat("MODIFY")
                : bodyTemplate.title,
              image: bodyTemplate.image
                ? course.title.concat("MODIFY")
                : bodyTemplate.image,
              description: bodyTemplate.description
                ? course.description
                  ? course.description.concat("MODIFY")
                  : "MODIFY"
                : bodyTemplate.description,
              material: bodyTemplate.material
                ? course.material
                  ? course.material.concat("MODIFY")
                  : "MODIFY"
                : bodyTemplate.material,
            };

            if (bodyTemplate.status) {
              modifiedBody.status =
                course.status.toString() === CourseStatus.DRAFT.toString()
                  ? CourseStatus.PUBLISHED
                  : CourseStatus.DRAFT;
            }

            if (bodyTemplate.categoryId) {
              const category = await randPrisma.generateCategory();
              modifiedBody.categoryId = category.id;
            }

            return modifiedBody;
          },
          test: async (testParams: TestParams) => {
            const { mockRequest, mockResponse, next, course } = testParams;
            const spyOnUpdateCourseService = jest.spyOn(
              CourseService.prototype,
              "updateCourse"
            );

            await controller.updateCourse(mockRequest, mockResponse, next);

            expect(spyOnUpdateCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnUpdateCourseService).toBeCalledWith(
              mockRequest.params.courseId,
              mockRequest.body
            );

            const updatedCourse = await spyOnUpdateCourseService.mock.results[0]
              .value;
            expect(updatedCourse).toBeDefined();
            bodyMatchCourse(
              {
                ...updatedCourse,
              },
              mockRequest.body,
              course
            );

            expect(next).toHaveBeenCalledTimes(0);
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.SUCCESS
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: updatedCourse,
            });
          },
        },
        {
          name: "OK: Update title",
          generateBody: async (course: CourseModel) => {
            const bodyTemplate: UpdateCourseDto = {
              title: "any",
            };
            const modifiedBody: UpdateCourseDto = {
              title: bodyTemplate.title
                ? course.title.concat("MODIFY")
                : bodyTemplate.title,
              image: bodyTemplate.image
                ? course.title.concat("MODIFY")
                : bodyTemplate.image,
              description: bodyTemplate.description
                ? course.description
                  ? course.description.concat("MODIFY")
                  : "MODIFY"
                : bodyTemplate.description,
              material: bodyTemplate.material
                ? course.material
                  ? course.material.concat("MODIFY")
                  : "MODIFY"
                : bodyTemplate.material,
            };

            if (bodyTemplate.status) {
              modifiedBody.status =
                course.status.toString() === CourseStatus.DRAFT.toString()
                  ? CourseStatus.PUBLISHED
                  : CourseStatus.DRAFT;
            }

            if (bodyTemplate.categoryId) {
              const category = await randPrisma.generateCategory();
              modifiedBody.categoryId = category.id;
            }

            return modifiedBody;
          },
          test: async (testParams: TestParams) => {
            const { mockRequest, mockResponse, next, course } = testParams;
            const spyOnUpdateCourseService = jest.spyOn(
              CourseService.prototype,
              "updateCourse"
            );

            await controller.updateCourse(mockRequest, mockResponse, next);

            expect(spyOnUpdateCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnUpdateCourseService).toBeCalledWith(
              mockRequest.params.courseId,
              mockRequest.body
            );

            const updatedCourse = await spyOnUpdateCourseService.mock.results[0]
              .value;
            expect(updatedCourse).toBeDefined();
            expect(updatedCourse.title).toBeDefined();
            expect(updatedCourse.title).toEqual(mockRequest.body.title);
            bodyMatchCourse(
              {
                ...updatedCourse,
              },
              mockRequest.body,
              course
            );

            expect(next).toHaveBeenCalledTimes(0);
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.SUCCESS
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: updatedCourse,
            });
          },
        },
        {
          name: "OK: Update categoryId",
          generateBody: async (course: CourseModel) => {
            const bodyTemplate: UpdateCourseDto = {
              categoryId: 1,
            };
            const modifiedBody: UpdateCourseDto = {
              title: bodyTemplate.title
                ? course.title.concat("MODIFY")
                : bodyTemplate.title,
              image: bodyTemplate.image
                ? course.title.concat("MODIFY")
                : bodyTemplate.image,
              description: bodyTemplate.description
                ? course.description
                  ? course.description.concat("MODIFY")
                  : "MODIFY"
                : bodyTemplate.description,
              material: bodyTemplate.material
                ? course.material
                  ? course.material.concat("MODIFY")
                  : "MODIFY"
                : bodyTemplate.material,
            };

            if (bodyTemplate.status) {
              modifiedBody.status =
                course.status.toString() === CourseStatus.DRAFT.toString()
                  ? CourseStatus.PUBLISHED
                  : CourseStatus.DRAFT;
            }

            if (bodyTemplate.categoryId) {
              const category = await randPrisma.generateCategory();
              modifiedBody.categoryId = category.id;
            }

            return modifiedBody;
          },
          test: async (testParams: TestParams) => {
            const { mockRequest, mockResponse, next, course } = testParams;
            const spyOnUpdateCourseService = jest.spyOn(
              CourseService.prototype,
              "updateCourse"
            );

            await controller.updateCourse(mockRequest, mockResponse, next);

            expect(spyOnUpdateCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnUpdateCourseService).toBeCalledWith(
              mockRequest.params.courseId,
              mockRequest.body
            );

            const updatedCourse = await spyOnUpdateCourseService.mock.results[0]
              .value;
            expect(updatedCourse).toBeDefined();
            expect(updatedCourse.categoryId).toBeDefined();
            expect(updatedCourse.categoryId).toEqual(
              mockRequest.body.categoryId
            );
            bodyMatchCourse(
              {
                ...updatedCourse,
              },
              mockRequest.body,
              course
            );

            expect(next).toHaveBeenCalledTimes(0);
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.SUCCESS
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: updatedCourse,
            });
          },
        },
        {
          name: "OK: Update image",
          generateBody: async (course: CourseModel) => {
            const bodyTemplate: UpdateCourseDto = {
              image: "any",
            };
            const modifiedBody: UpdateCourseDto = {
              title: bodyTemplate.title
                ? course.title.concat("MODIFY")
                : bodyTemplate.title,
              image: bodyTemplate.image
                ? course.title.concat("MODIFY")
                : bodyTemplate.image,
              description: bodyTemplate.description
                ? course.description
                  ? course.description.concat("MODIFY")
                  : "MODIFY"
                : bodyTemplate.description,
              material: bodyTemplate.material
                ? course.material
                  ? course.material.concat("MODIFY")
                  : "MODIFY"
                : bodyTemplate.material,
            };

            if (bodyTemplate.status) {
              modifiedBody.status =
                course.status.toString() === CourseStatus.DRAFT.toString()
                  ? CourseStatus.PUBLISHED
                  : CourseStatus.DRAFT;
            }

            if (bodyTemplate.categoryId) {
              const category = await randPrisma.generateCategory();
              modifiedBody.categoryId = category.id;
            }

            return modifiedBody;
          },
          test: async (testParams: TestParams) => {
            const { mockRequest, mockResponse, next, course } = testParams;
            const spyOnUpdateCourseService = jest.spyOn(
              CourseService.prototype,
              "updateCourse"
            );

            await controller.updateCourse(mockRequest, mockResponse, next);

            expect(spyOnUpdateCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnUpdateCourseService).toBeCalledWith(
              mockRequest.params.courseId,
              mockRequest.body
            );

            const updatedCourse = await spyOnUpdateCourseService.mock.results[0]
              .value;
            expect(updatedCourse).toBeDefined();
            expect(updatedCourse.image).toBeDefined();
            expect(updatedCourse.image).toEqual(mockRequest.body.image);
            bodyMatchCourse(
              {
                ...updatedCourse,
              },
              mockRequest.body,
              course
            );

            expect(next).toHaveBeenCalledTimes(0);
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.SUCCESS
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: updatedCourse,
            });
          },
        },
        {
          name: "OK: Update description",
          generateBody: async (course: CourseModel) => {
            const bodyTemplate: UpdateCourseDto = {
              description: "any",
            };
            const modifiedBody: UpdateCourseDto = {
              title: bodyTemplate.title
                ? course.title.concat("MODIFY")
                : bodyTemplate.title,
              image: bodyTemplate.image
                ? course.title.concat("MODIFY")
                : bodyTemplate.image,
              description: bodyTemplate.description
                ? course.description
                  ? course.description.concat("MODIFY")
                  : "MODIFY"
                : bodyTemplate.description,
              material: bodyTemplate.material
                ? course.material
                  ? course.material.concat("MODIFY")
                  : "MODIFY"
                : bodyTemplate.material,
            };

            if (bodyTemplate.status) {
              modifiedBody.status =
                course.status.toString() === CourseStatus.DRAFT.toString()
                  ? CourseStatus.PUBLISHED
                  : CourseStatus.DRAFT;
            }

            if (bodyTemplate.categoryId) {
              const category = await randPrisma.generateCategory();
              modifiedBody.categoryId = category.id;
            }

            return modifiedBody;
          },
          test: async (testParams: TestParams) => {
            const { mockRequest, mockResponse, next, course } = testParams;
            const spyOnUpdateCourseService = jest.spyOn(
              CourseService.prototype,
              "updateCourse"
            );

            await controller.updateCourse(mockRequest, mockResponse, next);

            expect(spyOnUpdateCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnUpdateCourseService).toBeCalledWith(
              mockRequest.params.courseId,
              mockRequest.body
            );

            const updatedCourse = await spyOnUpdateCourseService.mock.results[0]
              .value;
            expect(updatedCourse).toBeDefined();
            expect(updatedCourse.description).toBeDefined();
            expect(updatedCourse.description).toEqual(
              mockRequest.body.description
            );
            bodyMatchCourse(
              {
                ...updatedCourse,
              },
              mockRequest.body,
              course
            );

            expect(next).toHaveBeenCalledTimes(0);
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.SUCCESS
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: updatedCourse,
            });
          },
        },
        {
          name: "OK: Update material",
          generateBody: async (course: CourseModel) => {
            const bodyTemplate: UpdateCourseDto = {
              material: "any",
            };
            const modifiedBody: UpdateCourseDto = {
              title: bodyTemplate.title
                ? course.title.concat("MODIFY")
                : bodyTemplate.title,
              image: bodyTemplate.image
                ? course.title.concat("MODIFY")
                : bodyTemplate.image,
              description: bodyTemplate.description
                ? course.description
                  ? course.description.concat("MODIFY")
                  : "MODIFY"
                : bodyTemplate.description,
              material: bodyTemplate.material
                ? course.material
                  ? course.material.concat("MODIFY")
                  : "MODIFY"
                : bodyTemplate.material,
            };

            if (bodyTemplate.status) {
              modifiedBody.status =
                course.status.toString() === CourseStatus.DRAFT.toString()
                  ? CourseStatus.PUBLISHED
                  : CourseStatus.DRAFT;
            }

            if (bodyTemplate.categoryId) {
              const category = await randPrisma.generateCategory();
              modifiedBody.categoryId = category.id;
            }

            return modifiedBody;
          },
          test: async (testParams: TestParams) => {
            const { mockRequest, mockResponse, next, course } = testParams;
            const spyOnUpdateCourseService = jest.spyOn(
              CourseService.prototype,
              "updateCourse"
            );

            await controller.updateCourse(mockRequest, mockResponse, next);

            expect(spyOnUpdateCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnUpdateCourseService).toBeCalledWith(
              mockRequest.params.courseId,
              mockRequest.body
            );

            const updatedCourse = await spyOnUpdateCourseService.mock.results[0]
              .value;
            expect(updatedCourse).toBeDefined();
            expect(updatedCourse.material).toBeDefined();
            expect(updatedCourse.material).toEqual(mockRequest.body.material);
            bodyMatchCourse(
              {
                ...updatedCourse,
              },
              mockRequest.body,
              course
            );

            expect(next).toHaveBeenCalledTimes(0);
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.SUCCESS
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: updatedCourse,
            });
          },
        },
        {
          name: "BadRequest: Non-existent Course",
          generateBody: async (course: CourseModel) => {
            const bodyTemplate: UpdateCourseDto = {
              status: CourseStatus.DRAFT,
            };
            const modifiedBody: UpdateCourseDto = {
              title: bodyTemplate.title
                ? course.title.concat("MODIFY")
                : bodyTemplate.title,
              image: bodyTemplate.image
                ? course.title.concat("MODIFY")
                : bodyTemplate.image,
              description: bodyTemplate.description
                ? course.description
                  ? course.description.concat("MODIFY")
                  : "MODIFY"
                : bodyTemplate.description,
              material: bodyTemplate.material
                ? course.material
                  ? course.material.concat("MODIFY")
                  : "MODIFY"
                : bodyTemplate.material,
            };

            if (bodyTemplate.status) {
              modifiedBody.status =
                course.status.toString() === CourseStatus.DRAFT.toString()
                  ? CourseStatus.PUBLISHED
                  : CourseStatus.DRAFT;
            }

            if (bodyTemplate.categoryId) {
              const category = await randPrisma.generateCategory();
              modifiedBody.categoryId = category.id;
            }

            return modifiedBody;
          },
          test: async (testParams: TestParams) => {
            const { mockRequest, mockResponse, next, course } = testParams;
            mockNextError(mockRequest, mockResponse, next);
            const spyOnUpdateCourseService = jest.spyOn(
              CourseService.prototype,
              "updateCourse"
            );

            await prisma.course.delete({
              where: {
                id: course.id,
              },
            });
            await controller.updateCourse(mockRequest, mockResponse, next);

            expect(spyOnUpdateCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnUpdateCourseService).toBeCalledWith(
              mockRequest.params.courseId,
              mockRequest.body
            );

            // const newCourseFromService = await spyOnUpdateCourseService.mock
            //   .results[0].value;
            // expect(newCourseFromService).toBeDefined()
            // expect(newCourseFromService).toEqual(
            //   expect.any(Prisma.PrismaClientKnownRequestError)
            // );

            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(
              expect.any(Prisma.PrismaClientKnownRequestError)
            );
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.BAD_REQUEST
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              error: {
                errorCode: ErrorCode.NON_EXISTENT_RESOURCE,
                message: expect.any(String),
              },
            });
          },
        },
      ];

      testCases.forEach((tc) => {
        return it(tc.name, async () => {
          user = await randPrisma.generateUser(Role.OWNER);
          (mockRequest as any).user = user;

          const { course } = await randPrisma.generateCourse();
          (mockRequest as any).params = {
            courseId: course.id,
          };

          mockRequest.body = await tc.generateBody(course);

          await tc.test({
            mockRequest,
            mockResponse,
            next,
            course,
          });
        });
      });
    });

    describe("DeleteCourse", () => {
      type TestParams = {
        mockRequest: Request;
        mockResponse: Response;
        next: NextFunction;
      };
      type TestCase = {
        name: string;
        createParams: () => Promise<{ courseId: string }>;
        test: (testParams: TestParams) => Promise<void>;
      };

      const testCases: TestCase[] = [
        {
          name: "OK: Valid courseId and No lesson",
          createParams: async () => {
            const { course } = await randPrisma.generateCourse();

            return {
              courseId: course.id.toString(),
            };
          },
          test: async (testParams: TestParams) => {
            const { mockRequest, mockResponse, next } = testParams;
            const spyOnDeleteCourseService = jest.spyOn(
              CourseService.prototype,
              "deleteCourse"
            );

            await controller.deleteCourse(mockRequest, mockResponse, next);

            expect(spyOnDeleteCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnDeleteCourseService).toBeCalledWith(
              Number(mockRequest.params.courseId)
            );

            const returnValueOfDeleteCourseService =
              await spyOnDeleteCourseService.mock.results[0].value;
            expect(returnValueOfDeleteCourseService).toEqual({});

            expect(next).not.toBeCalled();
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(StatusCode.SUCCESS);
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toBeCalledWith({ data: {} });
          },
        },
        {
          // TODO : insert like and enrollment
          name: "OK: Valid courseId with Lesson, Video, Like, and Enrollment",
          createParams: async () => {
            const { course } = await randPrisma.generateCourse();

            return {
              courseId: course.id.toString(),
            };
          },
          test: async (testParams: TestParams) => {
            const { mockRequest, mockResponse, next } = testParams;
            const spyOnDeleteCourseService = jest.spyOn(
              CourseService.prototype,
              "deleteCourse"
            );
            const courseId = Number(mockRequest.params.courseId);

            const user1 = await randPrisma.generateUser(Role.STUDENT);
            const user2 = await randPrisma.generateUser(Role.STUDENT);

            const enrollment2 = await randPrisma.insertOneEnrollmentIntoCourse(
              user2.id,
              courseId,
              Role.STUDENT
            );
            const enrollment1 = await randPrisma.insertOneEnrollmentIntoCourse(
              user1.id,
              courseId,
              Role.STUDENT
            );

            const like1 = await randPrisma.insertOneLikeIntoCourse(
              user1.id,
              courseId
            );
            const like2 = await randPrisma.insertOneLikeIntoCourse(
              user2.id,
              courseId
            );

            const [lesson1, lesson2] =
              await randPrisma.insertManyLessonsIntoCourse(courseId, 2);
            const [video1_1, video2_1] =
              await randPrisma.insertManyVideosIntoLesson(lesson1.id, 2);
            const [video1_2, video2_2] =
              await randPrisma.insertManyVideosIntoLesson(lesson2.id, 2);

            await controller.deleteCourse(mockRequest, mockResponse, next);

            await expect(spyOnDeleteCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnDeleteCourseService).toBeCalledWith(courseId);

            const enrollment1After = await prisma.courseEnrollment.findUnique({
              where: {
                id: enrollment1.id,
              },
            });
            const enrollment2After = await prisma.courseEnrollment.findUnique({
              where: {
                id: enrollment2.id,
              },
            });
            expect(enrollment1After).toBeNull();
            expect(enrollment2After).toBeNull();

            const like1After = await prisma.courseLike.findUnique({
              where: {
                id: like1.id,
              },
            });
            const like2After = await prisma.courseLike.findUnique({
              where: {
                id: like1.id,
              },
            });
            expect(like1After).toBeNull();
            expect(like2After).toBeNull();

            const lesson1After = await prisma.courseLesson.findUnique({
              where: {
                id: lesson1.id,
              },
            });
            const lesson2After = await prisma.courseLesson.findUnique({
              where: { id: lesson2.id },
            });
            expect(lesson1After).toBeNull();
            expect(lesson2After).toBeNull();

            const video1_1After = await prisma.courseLessonVideo.findUnique({
              where: { id: video1_1.id },
            });
            const video2_1After = await prisma.courseLessonVideo.findUnique({
              where: { id: video2_1.id },
            });
            expect(video1_1After).toBeNull();
            expect(video2_1After).toBeNull();

            const video1_2After = await prisma.courseLessonVideo.findUnique({
              where: { id: video1_2.id },
            });
            const video2_2After = await prisma.courseLessonVideo.findUnique({
              where: { id: video2_2.id },
            });
            expect(video1_2After).toBeNull();
            expect(video2_2After).toBeNull();

            const returnValueOfDeleteCourseService =
              await spyOnDeleteCourseService.mock.results[0].value;
            expect(returnValueOfDeleteCourseService).toEqual({});

            expect(next).not.toBeCalled();
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(StatusCode.SUCCESS);
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toBeCalledWith({ data: {} });
          },
        },
        {
          // TODO : insert like and enrollment
          name: "BadRequest: Non-existent Course",
          createParams: async () => {
            const { course } = await randPrisma.generateCourse();

            return {
              courseId: course.id.toString(),
            };
          },
          test: async (testParams: TestParams) => {
            const { mockRequest, mockResponse, next } = testParams;
            mockNextError(mockRequest, mockResponse, next);
            const spyOnDeleteCourseService = jest.spyOn(
              CourseService.prototype,
              "deleteCourse"
            );
            const courseId = Number(mockRequest.params.courseId);

            await prisma.course.delete({
              where: {
                id: courseId,
              },
            });
            await controller.deleteCourse(mockRequest, mockResponse, next);

            await expect(spyOnDeleteCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnDeleteCourseService).toBeCalledWith(courseId);

            // const returnValueOfDeleteCourseService =
            //   await spyOnDeleteCourseService.mock.results[0].value;
            // expect(returnValueOfDeleteCourseService).toEqual({});

            expect(next).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(StatusCode.BAD_REQUEST);
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toBeCalledWith({
              error: {
                errorCode: ErrorCode.NON_EXISTENT_RESOURCE,
                message: expect.any(String),
              },
            });
          },
        },
      ];

      testCases.forEach((tc) => {
        return it(tc.name, async () => {
          const params = await tc.createParams();
          (mockRequest as Request).params = params;

          await tc.test({ mockRequest, mockResponse, next });
        });
      });
    });
  });

  describe("CourseLike", () => {
    describe("CreateLike", () => {
      type TestParams = {
        mockRequest: Request;
        mockResponse: Response;
        next: NextFunction;
      };
      type TestCase = {
        name: string;
        modifyBody: (
          bodyTemplate: CreateCourseLikeDto
        ) => Partial<CreateCourseLikeDto>;
        test: (testParams: TestParams) => Promise<void>;
      };

      const testCases: TestCase[] = [
        {
          name: "OK: Complete Body",
          modifyBody: (
            bodyTemplate: CreateCourseLikeDto
          ): Partial<CreateCourseLikeDto> => {
            return {
              ...bodyTemplate,
            };
          },
          test: async (testParams: TestParams) => {
            const { mockRequest, mockResponse, next } = testParams;
            const user = await randPrisma.generateUser(Role.STUDENT);
            const { course } = await randPrisma.generateCourse();

            (mockRequest as any).user = user;
            (mockRequest as any).resourceId = {
              courseId: course.id,
            } satisfies CourseLikeResourceId;

            const spyOnCreateCourseLikeService = jest.spyOn(
              CourseService.prototype,
              "createLike"
            );

            await controller.createLike(mockRequest, mockResponse, next);

            expect(spyOnCreateCourseLikeService).toHaveBeenCalledTimes(1);
            expect(spyOnCreateCourseLikeService).toHaveBeenCalledWith(
              user.id,
              (mockRequest as any).resourceId
            );
            const newCourseLikeFromService = await spyOnCreateCourseLikeService
              .mock.results[0].value;

            const courseAfter = await prisma.course.findUnique({
              where: {
                id: course.id,
              },
            });
            expect(courseAfter?.totalLikes).toEqual(1);

            expect(next).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.RESOURCE_CREATED
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: newCourseLikeFromService,
            });
          },
        },
        {
          name: "BadRequest: CourseLike Already Exist",
          modifyBody: (
            bodyTemplate: CreateCourseLikeDto
          ): Partial<CreateCourseLikeDto> => {
            return {
              ...bodyTemplate,
            };
          },
          test: async (testParams: TestParams) => {
            const { mockRequest, mockResponse, next } = testParams;
            mockNextError(mockRequest, mockResponse, next);
            const user = await randPrisma.generateUser(Role.STUDENT);
            const { course } = await randPrisma.generateCourse();
            await randPrisma.insertOneLikeIntoCourse(user.id, course.id);

            const courseBefore = await prisma.course.findUniqueOrThrow({
              where: {
                id: course.id,
              },
            });
            expect(courseBefore.totalLikes).toEqual(1);

            (mockRequest as any).user = user;
            (mockRequest as any).resourceId = {
              courseId: course.id,
            } satisfies CourseLikeResourceId;

            const spyOnCreateCourseLikeService = jest.spyOn(
              CourseService.prototype,
              "createLike"
            );

            await controller.createLike(mockRequest, mockResponse, next);

            expect(spyOnCreateCourseLikeService).toHaveBeenCalledTimes(1);
            expect(spyOnCreateCourseLikeService).toHaveBeenCalledWith(
              user.id,
              (mockRequest as any).resourceId
            );

            const courseAfter = await prisma.course.findUnique({
              where: {
                id: course.id,
              },
            });
            expect(courseAfter?.totalLikes).toEqual(1);

            expect(next).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.BAD_REQUEST
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              error: {
                errorCode: ErrorCode.UNIQUE_CONSTRAINT,
                message: expect.any(String),
              },
            });
          },
        },
      ];

      testCases.forEach((tc) => {
        return it(tc.name, async () => {
          await tc.test({ mockRequest, mockResponse, next });
        });
      });
    });

    describe("DeleteLike", () => {
      type TestParams = {
        mockRequest: Request;
        mockResponse: Response;
        next: NextFunction;
      };
      type TestCase = {
        name: string;
        test: (testParams: TestParams) => Promise<void>;
      };

      const testCases: TestCase[] = [
        {
          name: "OK",
          test: async (testParams: TestParams) => {
            const { mockRequest, mockResponse, next } = testParams;
            const user = await randPrisma.generateUser(Role.STUDENT);
            const { course } = await randPrisma.generateCourse();
            const like = await randPrisma.insertOneLikeIntoCourse(
              user.id,
              course.id
            );

            const courseBefore = await prisma.course.findUniqueOrThrow({
              where: {
                id: course.id,
              },
            });
            expect(courseBefore.totalLikes).toEqual(1);

            (mockRequest as any).resourceId = {
              courseId: course.id,
              likeId: like.id,
            } satisfies CourseLikeResourceId;

            const spyOnDeleteCourseLikeService = jest.spyOn(
              CourseService.prototype,
              "deleteLike"
            );

            await controller.deleteLike(mockRequest, mockResponse, next);

            expect(spyOnDeleteCourseLikeService).toHaveBeenCalledTimes(1);
            expect(spyOnDeleteCourseLikeService).toHaveBeenCalledWith(
              (mockRequest as any).resourceId
            );
            const newCourseLikeFromService = await spyOnDeleteCourseLikeService
              .mock.results[0].value;

            const likeAfter = await prisma.courseLike.findUnique({
              where: {
                id: like.id,
              },
            });
            expect(likeAfter).toBeNull();

            const courseAfter = await prisma.course.findUnique({
              where: {
                id: course.id,
              },
            });
            expect(courseAfter?.totalLikes).toEqual(0);

            expect(next).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.SUCCESS
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({ data: {} });
          },
        },
      ];

      testCases.forEach((tc) => {
        return it(tc.name, async () => {
          await tc.test({ mockRequest, mockResponse, next });
        });
      });
    });
  });

  describe("CourseCategory", () => {});
});
