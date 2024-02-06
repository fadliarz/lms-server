import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
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
import { CourseStatus, Prisma, Role } from "@prisma/client";
import { CourseService } from "./service/course.service";
import { ErrorCode } from "../../common/constants/errorCode";
import HttpException from "../../common/class/exceptions/HttpException";
import RandPrisma from "../../common/class/randprisma/RandPrisma";
import RandDB from "../../common/class/randprisma/rand.type";
import { PrismaTableDITypes } from "../../common/class/table/PrismaTable";
import { ITable } from "../../common/class/table/table.type";

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

describe("", () => {
  let controller: ICourseController;
  let table: ITable;
  let randDb: RandDB;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeAll(async () => {
    controller = dIContainer.get<ICourseController>(CourseDITypes.CONTROLLER);
    table = dIContainer.get<ITable>(PrismaTableDITypes.TABLE);
    randDb = new RandPrisma();
  });

  beforeEach(() => {
    mockRequest = {} as Request;
    mockResponse = {
      status: jest.fn(() => mockResponse),
      json: jest.fn(),
    } as any as Response;
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("Course", () => {
    describe("CreateCourse", () => {
      function dtoMatchCourse(
        dto: CreateCourseDto,
        createdCourse: CourseModel,
      ) {
        expect(dto.title).toEqual(createdCourse.title);
        expect(dto.categoryId).toEqual(createdCourse.categoryId);
        expect(dto.description).toEqual(createdCourse.description);
        expect(
          dto.image ||
            "https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg",
        ).toEqual(createdCourse.image);
        expect(dto.material).toEqual(createdCourse.material);
      }

      type TestParams = {
        mockRequest: Request;
        mockResponse: Response;
        mockNext: NextFunction;
      };
      type TestCase = {
        name: string;
        modifyDto: (dto: CreateCourseDto) => Partial<CreateCourseDto>;
        test: (params: TestParams) => void;
      };

      const testCases: TestCase[] = [
        {
          name: "OK: Complete Body",
          modifyDto: (dto: CreateCourseDto): Partial<CreateCourseDto> => {
            return {
              ...dto,
            };
          },
          test: async (params: TestParams) => {
            const { mockRequest, mockResponse, mockNext } = params;
            const spyOnCreateCourseService = jest.spyOn(
              CourseService.prototype,
              "createCourse",
            );

            await controller.createCourse(mockRequest, mockResponse, mockNext);

            expect(spyOnCreateCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnCreateCourseService).toHaveBeenCalledWith(
              (mockRequest as any).user.id,
              mockRequest.body,
            );

            const newCourseFromService = (await spyOnCreateCourseService.mock
              .results[0].value) satisfies CourseModel;

            dtoMatchCourse(mockRequest.body, newCourseFromService);

            expect(mockNext).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.RESOURCE_CREATED,
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: newCourseFromService,
            });
          },
        },
        {
          name: "OK: Missing image",
          modifyDto: (dto: CreateCourseDto): Partial<CreateCourseDto> => {
            return {
              ...dto,
              image: undefined,
            };
          },
          test: async (params: TestParams) => {
            const { mockRequest, mockResponse, mockNext } = params;
            const spyOnCreateCourseService = jest.spyOn(
              CourseService.prototype,
              "createCourse",
            );

            await controller.createCourse(mockRequest, mockResponse, mockNext);

            expect(spyOnCreateCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnCreateCourseService).toHaveBeenCalledWith(
              (mockRequest as any).user.id,
              mockRequest.body,
            );
            const newCourseFromService =
              await spyOnCreateCourseService.mock.results[0].value;

            dtoMatchCourse(mockRequest.body, newCourseFromService);

            expect(mockNext).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.RESOURCE_CREATED,
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: newCourseFromService,
            });
          },
        },
        {
          name: "OK: Missing description",
          modifyDto: (dto: CreateCourseDto): Partial<CreateCourseDto> => {
            return {
              ...dto,
              description: undefined,
            };
          },
          test: async (params: TestParams) => {
            const { mockRequest, mockResponse, mockNext } = params;
            const spyOnCreateCourseService = jest.spyOn(
              CourseService.prototype,
              "createCourse",
            );

            await controller.createCourse(mockRequest, mockResponse, mockNext);

            expect(spyOnCreateCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnCreateCourseService).toHaveBeenCalledWith(
              (mockRequest as any).user.id,
              mockRequest.body,
            );
            const newCourseFromService =
              await spyOnCreateCourseService.mock.results[0].value;

            dtoMatchCourse(mockRequest.body, newCourseFromService);

            expect(mockNext).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.RESOURCE_CREATED,
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: newCourseFromService,
            });
          },
        },
        {
          name: "OK: Missing material",
          modifyDto: (dto: CreateCourseDto): Partial<CreateCourseDto> => {
            return {
              ...dto,
              material: undefined,
            };
          },
          test: async (params: TestParams) => {
            const { mockRequest, mockResponse, mockNext } = params;
            const spyOnCreateCourseService = jest.spyOn(
              CourseService.prototype,
              "createCourse",
            );

            await controller.createCourse(mockRequest, mockResponse, mockNext);

            expect(spyOnCreateCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnCreateCourseService).toHaveBeenCalledWith(
              (mockRequest as any).user.id,
              mockRequest.body,
            );
            const newCourseFromService =
              await spyOnCreateCourseService.mock.results[0].value;

            dtoMatchCourse(mockRequest.body, newCourseFromService);

            expect(mockNext).not.toHaveBeenCalled();

            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.RESOURCE_CREATED,
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: newCourseFromService,
            });
          },
        },
        {
          name: "BadRequest: Missing title",
          modifyDto: (dto: CreateCourseDto): Partial<CreateCourseDto> => {
            return {
              ...dto,
              title: undefined,
            };
          },
          test: async (params: TestParams) => {
            const { mockRequest, mockResponse, mockNext } = params;
            mockNextError(mockRequest, mockResponse, mockNext);
            const spyOnCreateCourseService = jest.spyOn(
              CourseService.prototype,
              "createCourse",
            );

            await controller.createCourse(mockRequest, mockResponse, mockNext);

            expect(spyOnCreateCourseService).not.toHaveBeenCalled();

            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(expect.any(HttpException));
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.BAD_REQUEST,
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
          modifyDto: (dto: CreateCourseDto): Partial<CreateCourseDto> => {
            return {
              ...dto,
              categoryId: undefined,
            };
          },
          test: async (params: TestParams) => {
            const { mockRequest, mockResponse, mockNext } = params;
            mockNextError(mockRequest, mockResponse, mockNext);
            const spyOnCreateCourseService = jest.spyOn(
              CourseService.prototype,
              "createCourse",
            );

            await controller.createCourse(mockRequest, mockResponse, mockNext);

            expect(spyOnCreateCourseService).not.toHaveBeenCalled();

            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(expect.any(HttpException));
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.BAD_REQUEST,
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
          const user = await randDb.generateUser(Role.OWNER);
          (mockRequest as any).user = user;

          const category = await randDb.generateCategory();
          const dto = generateRandomCreateCourseDto(category.id);
          mockRequest.body = tc.modifyDto(dto);

          await tc.test({ mockRequest, mockResponse, mockNext });
        });
      });
    });

    describe("GetCourseById", () => {
      function dtoMatchCourse(
        responseCourse: GetCourseByIdResBody,
        course: CourseModel,
      ) {
        expect(responseCourse.title).toEqual(course.title);
        expect(responseCourse.categoryId).toEqual(course.categoryId);
        expect(responseCourse.description).toEqual(course.description);
        expect(
          responseCourse.image ||
            "https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg",
        ).toEqual(course.image);
        expect(responseCourse.material).toEqual(course.material);
      }

      function resMatchAuthor(responseAuthor: BasicUser, author: UserModel) {
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
        category: CourseCategoryModel,
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
        mockNext: NextFunction;
      };
      type TestCase = {
        name: string;
        modifyQuery: (
          queryTemplate: GetCourseByIdQuery,
        ) => Partial<GetCourseByIdQuery>;
        test: (params: TestParams) => Promise<void>;
      };

      const testCases: TestCase[] = [
        {
          name: "OK: No Query",
          modifyQuery: (
            queryTemplate: GetCourseByIdQuery,
          ): Partial<GetCourseByIdQuery> => {
            return {
              ...queryTemplate,
            };
          },
          test: async (params: TestParams) => {
            const { mockRequest, mockResponse, mockNext } = params;
            const { course } = await randDb.generateCourse();
            (mockRequest as any).params = { courseId: course.id };
            const spyOnGetCourseByIdService = jest.spyOn(
              CourseService.prototype,
              "getCourseById",
            );
            await controller.getCourseById(mockRequest, mockResponse, mockNext);

            expect(spyOnGetCourseByIdService).toHaveBeenCalledTimes(1);
            expect(spyOnGetCourseByIdService).toHaveBeenCalledWith(
              mockRequest.params.courseId,
              mockRequest.query,
            );

            const responseCourse: GetCourseByIdResBody =
              await spyOnGetCourseByIdService.mock.results[0].value;
            dtoMatchCourse(responseCourse, course);
            expect(responseCourse.author).toBe(undefined);
            expect(responseCourse.students).toBe(undefined);
            expect(responseCourse.instructors).toBe(undefined);
            expect(responseCourse.category).toBe(undefined);
            expect(responseCourse.playlist).toBe(undefined);

            expect(mockNext).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.SUCCESS,
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
            queryTemplate: GetCourseByIdQuery,
          ): Partial<GetCourseByIdQuery> => {
            return {
              ...queryTemplate,
              include_author: true,
            };
          },
          test: async (params: TestParams) => {
            const { mockRequest, mockResponse, mockNext } = params;
            const { author, course } = await randDb.generateCourse();
            (mockRequest as any).params = { courseId: course.id };
            const spyOnGetCourseByIdService = jest.spyOn(
              CourseService.prototype,
              "getCourseById",
            );
            await controller.getCourseById(mockRequest, mockResponse, mockNext);

            expect(spyOnGetCourseByIdService).toHaveBeenCalledTimes(1);
            expect(spyOnGetCourseByIdService).toHaveBeenCalledWith(
              (mockRequest as any).params.courseId,
              (mockRequest as any).query,
            );

            const responseCourse: GetCourseByIdResBody =
              await spyOnGetCourseByIdService.mock.results[0].value;
            dtoMatchCourse(responseCourse, course);
            expect(responseCourse.author).not.toBe(undefined);
            resMatchAuthor(responseCourse.author as BasicUser, author);
            expect(responseCourse.students).toBe(undefined);
            expect(responseCourse.instructors).toBe(undefined);
            expect(responseCourse.category).toBe(undefined);
            expect(responseCourse.playlist).toBe(undefined);

            expect(mockNext).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.SUCCESS,
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
            queryTemplate: GetCourseByIdQuery,
          ): Partial<GetCourseByIdQuery> => {
            return {
              ...queryTemplate,
              include_category: true,
            };
          },
          test: async (params: TestParams) => {
            const { mockRequest, mockResponse, mockNext } = params;
            const { category, course } = await randDb.generateCourse();
            (mockRequest as any).params = { courseId: course.id };
            const spyOnGetCourseByIdService = jest.spyOn(
              CourseService.prototype,
              "getCourseById",
            );
            await controller.getCourseById(mockRequest, mockResponse, mockNext);

            expect(spyOnGetCourseByIdService).toHaveBeenCalledTimes(1);
            expect(spyOnGetCourseByIdService).toHaveBeenCalledWith(
              (mockRequest as any).params.courseId,
              (mockRequest as any).query,
            );

            const responseCourse: GetCourseByIdResBody =
              await spyOnGetCourseByIdService.mock.results[0].value;
            dtoMatchCourse(responseCourse, course);
            expect(responseCourse.author).toBe(undefined);
            expect(responseCourse.students).toBe(undefined);
            expect(responseCourse.instructors).toBe(undefined);
            expect(responseCourse.category).not.toBe(undefined);
            bodyMatchCategory(
              responseCourse.category as BasicCategory,
              category,
            );
            expect(responseCourse.playlist).toBe(undefined);

            expect(mockNext).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.SUCCESS,
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
          const query: GetCourseByIdQuery = {};
          (mockRequest as any).query = tc.modifyQuery(query);

          await tc.test({
            mockRequest,
            mockResponse,
            mockNext,
          });
        });
      });
    });

    describe("UpdateCourse", () => {
      function dtoMatchCourse(
        updatedCourse: CourseModel,
        dto: UpdateCourseDto,
        oldCourse: CourseModel,
      ) {
        expect(updatedCourse).toBeDefined();
        expect(oldCourse).toBeDefined();
        expect(updatedCourse.id).toEqual(oldCourse.id);

        const keys = Object.keys(dto) as Array<keyof typeof dto>;
        keys.forEach((key) => {
          dto[key]
            ? expect(updatedCourse[key]).not.toEqual(oldCourse.title)
            : expect(updatedCourse[key]).toEqual(oldCourse[key]);
        });
      }

      type TestParams = {
        mockRequest: Request;
        mockResponse: Response;
        mockNext: NextFunction;
        oldCourse: CourseModel;
      };
      type TestCase = {
        name: string;
        generateDto: (course: CourseModel) => Promise<Partial<UpdateCourseDto>>;
        test: (testParams: TestParams) => Promise<void>;
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
          generateDto: async (
            course: CourseModel,
          ): Promise<Partial<UpdateCourseDto>> => {
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
              const category = await randDb.generateCategory();
              modifiedBody.categoryId = category.id;
            }

            return modifiedBody;
          },
          test: async (testParams: TestParams): Promise<void> => {
            const { mockRequest, mockResponse, mockNext, oldCourse } =
              testParams;
            const spyOnUpdateCourseService = jest.spyOn(
              CourseService.prototype,
              "updateCourse",
            );

            await controller.updateCourse(mockRequest, mockResponse, mockNext);

            expect(spyOnUpdateCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnUpdateCourseService).toBeCalledWith(
              mockRequest.params.courseId,
              mockRequest.body,
            );

            const updatedCourse =
              await spyOnUpdateCourseService.mock.results[0].value;
            dtoMatchCourse(updatedCourse, mockRequest.body, oldCourse);

            expect(mockNext).toHaveBeenCalledTimes(0);
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.SUCCESS,
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: updatedCourse,
            });
          },
        },
        {
          name: "OK: Update title",
          generateDto: async (
            course: CourseModel,
          ): Promise<Partial<UpdateCourseDto>> => {
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
              const category = await randDb.generateCategory();
              modifiedBody.categoryId = category.id;
            }

            return modifiedBody;
          },
          test: async (testParams: TestParams): Promise<void> => {
            const { mockRequest, mockResponse, mockNext, oldCourse } =
              testParams;
            const spyOnUpdateCourseService = jest.spyOn(
              CourseService.prototype,
              "updateCourse",
            );

            await controller.updateCourse(mockRequest, mockResponse, mockNext);

            expect(spyOnUpdateCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnUpdateCourseService).toBeCalledWith(
              mockRequest.params.courseId,
              mockRequest.body,
            );

            const updatedCourse =
              await spyOnUpdateCourseService.mock.results[0].value;
            expect(updatedCourse).toBeDefined();
            expect(updatedCourse.title).toBeDefined();
            expect(updatedCourse.title).toEqual(mockRequest.body.title);
            dtoMatchCourse(updatedCourse, mockRequest.body, oldCourse);

            expect(mockNext).toHaveBeenCalledTimes(0);
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.SUCCESS,
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: updatedCourse,
            });
          },
        },
        {
          name: "OK: Update categoryId",
          generateDto: async (course: CourseModel) => {
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
              const category = await randDb.generateCategory();
              modifiedBody.categoryId = category.id;
            }

            return modifiedBody;
          },
          test: async (testParams: TestParams) => {
            const { mockRequest, mockResponse, mockNext, oldCourse } =
              testParams;
            const spyOnUpdateCourseService = jest.spyOn(
              CourseService.prototype,
              "updateCourse",
            );

            await controller.updateCourse(mockRequest, mockResponse, mockNext);

            expect(spyOnUpdateCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnUpdateCourseService).toBeCalledWith(
              mockRequest.params.courseId,
              mockRequest.body,
            );

            const updatedCourse =
              await spyOnUpdateCourseService.mock.results[0].value;
            expect(updatedCourse).toBeDefined();
            expect(updatedCourse.categoryId).toBeDefined();
            expect(updatedCourse.categoryId).toEqual(
              mockRequest.body.categoryId,
            );
            dtoMatchCourse(updatedCourse, mockRequest.body, oldCourse);

            expect(mockNext).toHaveBeenCalledTimes(0);
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.SUCCESS,
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: updatedCourse,
            });
          },
        },
        {
          name: "OK: Update image",
          generateDto: async (course: CourseModel) => {
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
              const category = await randDb.generateCategory();
              modifiedBody.categoryId = category.id;
            }

            return modifiedBody;
          },
          test: async (testParams: TestParams) => {
            const { mockRequest, mockResponse, mockNext, oldCourse } =
              testParams;
            const spyOnUpdateCourseService = jest.spyOn(
              CourseService.prototype,
              "updateCourse",
            );

            await controller.updateCourse(mockRequest, mockResponse, mockNext);

            expect(spyOnUpdateCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnUpdateCourseService).toBeCalledWith(
              mockRequest.params.courseId,
              mockRequest.body,
            );

            const updatedCourse =
              await spyOnUpdateCourseService.mock.results[0].value;
            expect(updatedCourse).toBeDefined();
            expect(updatedCourse.image).toBeDefined();
            expect(updatedCourse.image).toEqual(mockRequest.body.image);
            dtoMatchCourse(updatedCourse, mockRequest.body, oldCourse);

            expect(mockNext).toHaveBeenCalledTimes(0);
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.SUCCESS,
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: updatedCourse,
            });
          },
        },
        {
          name: "OK: Update description",
          generateDto: async (course: CourseModel) => {
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
              const category = await randDb.generateCategory();
              modifiedBody.categoryId = category.id;
            }

            return modifiedBody;
          },
          test: async (testParams: TestParams) => {
            const { mockRequest, mockResponse, mockNext, oldCourse } =
              testParams;
            const spyOnUpdateCourseService = jest.spyOn(
              CourseService.prototype,
              "updateCourse",
            );

            await controller.updateCourse(mockRequest, mockResponse, mockNext);

            expect(spyOnUpdateCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnUpdateCourseService).toBeCalledWith(
              mockRequest.params.courseId,
              mockRequest.body,
            );

            const updatedCourse =
              await spyOnUpdateCourseService.mock.results[0].value;
            expect(updatedCourse).toBeDefined();
            expect(updatedCourse.description).toBeDefined();
            expect(updatedCourse.description).toEqual(
              mockRequest.body.description,
            );
            dtoMatchCourse(updatedCourse, mockRequest.body, oldCourse);

            expect(mockNext).toHaveBeenCalledTimes(0);
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.SUCCESS,
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: updatedCourse,
            });
          },
        },
        {
          name: "OK: Update material",
          generateDto: async (course: CourseModel) => {
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
              const category = await randDb.generateCategory();
              modifiedBody.categoryId = category.id;
            }

            return modifiedBody;
          },
          test: async (testParams: TestParams) => {
            const { mockRequest, mockResponse, mockNext, oldCourse } =
              testParams;
            const spyOnUpdateCourseService = jest.spyOn(
              CourseService.prototype,
              "updateCourse",
            );

            await controller.updateCourse(mockRequest, mockResponse, mockNext);

            expect(spyOnUpdateCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnUpdateCourseService).toBeCalledWith(
              mockRequest.params.courseId,
              mockRequest.body,
            );

            const updatedCourse =
              await spyOnUpdateCourseService.mock.results[0].value;
            expect(updatedCourse).toBeDefined();
            expect(updatedCourse.material).toBeDefined();
            expect(updatedCourse.material).toEqual(mockRequest.body.material);
            dtoMatchCourse(updatedCourse, mockRequest.body, oldCourse);

            expect(mockNext).toHaveBeenCalledTimes(0);
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.SUCCESS,
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: updatedCourse,
            });
          },
        },
        {
          name: "BadRequest: Non-existent Course",
          generateDto: async (course: CourseModel) => {
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
              const category = await randDb.generateCategory();
              modifiedBody.categoryId = category.id;
            }

            return modifiedBody;
          },
          test: async (testParams: TestParams) => {
            const {
              mockRequest,
              mockResponse,
              mockNext,
              oldCourse: { id: courseId },
            } = testParams;
            mockNextError(mockRequest, mockResponse, mockNext);
            const spyOnUpdateCourseService = jest.spyOn(
              CourseService.prototype,
              "updateCourse",
            );

            await table.course.delete(courseId);
            await controller.updateCourse(mockRequest, mockResponse, mockNext);

            expect(spyOnUpdateCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnUpdateCourseService).toBeCalledWith(
              mockRequest.params.courseId,
              mockRequest.body,
            );

            // const newCourseFromService = await spyOnUpdateCourseService.mock
            //   .results[0].value;
            // expect(newCourseFromService).toBeDefined()
            // expect(newCourseFromService).toEqual(
            //   expect.any(Prisma.PrismaClientKnownRequestError)
            // );

            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(
              expect.any(Prisma.PrismaClientKnownRequestError),
            );
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.BAD_REQUEST,
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
          const user = await randDb.generateUser(Role.OWNER);
          (mockRequest as any).user = user;

          const { course } = await randDb.generateCourse();
          (mockRequest as any).params = {
            courseId: course.id,
          };

          mockRequest.body = await tc.generateDto(course);

          await tc.test({
            mockRequest,
            mockResponse,
            mockNext,
            oldCourse: course,
          });
        });
      });
    });

    describe("DeleteCourse", () => {
      type TestParams = {
        mockRequest: Request;
        mockResponse: Response;
        mockNext: NextFunction;
      };
      type TestCase = {
        name: string;
        generateParams: () => Promise<{ courseId: string }>;
        test: (testParams: TestParams) => Promise<void>;
      };

      const testCases: TestCase[] = [
        {
          name: "OK: Valid courseId and No lesson",
          generateParams: async () => {
            const { course } = await randDb.generateCourse();

            return {
              courseId: course.id.toString(),
            };
          },
          test: async (testParams: TestParams) => {
            const { mockRequest, mockResponse, mockNext } = testParams;
            const spyOnDeleteCourseService = jest.spyOn(
              CourseService.prototype,
              "deleteCourse",
            );
            const courseId = Number(mockRequest.params.courseId);

            await controller.deleteCourse(mockRequest, mockResponse, mockNext);

            expect(spyOnDeleteCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnDeleteCourseService).toBeCalledWith(courseId);

            const returnValueOfDeleteCourseService =
              await spyOnDeleteCourseService.mock.results[0].value;
            expect(returnValueOfDeleteCourseService).toEqual({});

            const courseAfter = await table.course.findUnique(courseId);
            expect(courseAfter).toBeNull();

            expect(mockNext).not.toBeCalled();
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(StatusCode.SUCCESS);
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toBeCalledWith({ data: {} });
          },
        },
        {
          name: "OK: Valid courseId with Lesson, Video, Like, and Enrollment",
          generateParams: async () => {
            const { course } = await randDb.generateCourse();

            return {
              courseId: course.id.toString(),
            };
          },
          test: async (testParams: TestParams) => {
            const { mockRequest, mockResponse, mockNext } = testParams;
            const spyOnDeleteCourseService = jest.spyOn(
              CourseService.prototype,
              "deleteCourse",
            );
            const courseId = Number(mockRequest.params.courseId);

            const course = await table.course.findUniqueOrThrow(courseId);
            expect(course.totalStudents).toEqual(0);
            expect(course.totalInstructors).toEqual(0);
            expect(course.totalLikes).toEqual(0);
            expect(course.totalLessons).toEqual(0);
            expect(course.totalVideos).toEqual(0);
            expect(course.totalDurations).toEqual(0);

            const user1 = await randDb.generateUser(Role.STUDENT);
            const user2 = await randDb.generateUser(Role.STUDENT);
            const enrollment2 = await randDb.insertOneEnrollmentIntoCourse(
              user2.id,
              courseId,
              Role.STUDENT,
            );
            const enrollment1 = await randDb.insertOneEnrollmentIntoCourse(
              user1.id,
              courseId,
              Role.INSTRUCTOR,
            );

            const like1 = await randDb.insertOneLikeIntoCourse(
              user1.id,
              courseId,
            );
            const like2 = await randDb.insertOneLikeIntoCourse(
              user2.id,
              courseId,
            );

            const [lesson1, lesson2] = await randDb.insertManyLessonsIntoCourse(
              courseId,
              2,
            );

            const durationEachVideo = 1;
            const [video1_1, video2_1] =
              await randDb.insertManyVideosIntoLesson(
                lesson1.id,
                2,
                durationEachVideo,
              );
            const [video1_2, video2_2] =
              await randDb.insertManyVideosIntoLesson(
                lesson2.id,
                2,
                durationEachVideo,
              );

            const courseAfterInsertion =
              await table.course.findUniqueOrThrow(courseId);
            expect(courseAfterInsertion.totalStudents).toEqual(1);
            expect(courseAfterInsertion.totalInstructors).toEqual(1);
            expect(courseAfterInsertion.totalLikes).toEqual(2);
            expect(courseAfterInsertion.totalLessons).toEqual(2);
            expect(courseAfterInsertion.totalVideos).toEqual(4);
            expect(courseAfterInsertion.totalDurations).toEqual(
              4 * durationEachVideo,
            );

            await controller.deleteCourse(mockRequest, mockResponse, mockNext);

            await expect(spyOnDeleteCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnDeleteCourseService).toBeCalledWith(courseId);

            const returnValueOfDeleteCourseService =
              await spyOnDeleteCourseService.mock.results[0].value;
            expect(returnValueOfDeleteCourseService).toEqual({});

            const courseAfter = await table.course.findUnique(courseId);
            expect(courseAfter).toBeNull();

            const enrollment1After = await table.courseEnrollment.findUnique(
              enrollment1.id,
            );
            const enrollment2After = await table.courseEnrollment.findUnique(
              enrollment2.id,
            );
            expect(enrollment1After).toBeNull();
            expect(enrollment2After).toBeNull();

            const like1After = await table.courseLike.findUnique(like1.id);
            const like2After = await table.courseLike.findUnique(like2.id);
            expect(like1After).toBeNull();
            expect(like2After).toBeNull();

            const lesson1After = await table.courseLesson.findUnique(
              lesson1.id,
            );
            const lesson2After = await table.courseLesson.findUnique(
              lesson2.id,
            );
            expect(lesson1After).toBeNull();
            expect(lesson2After).toBeNull();

            const video1_1After = await table.courseLessonVideo.findUnique(
              video1_1.id,
            );
            const video2_1After = await table.courseLessonVideo.findUnique(
              video2_1.id,
            );
            expect(video1_1After).toBeNull();
            expect(video2_1After).toBeNull();

            const video1_2After = await table.courseLessonVideo.findUnique(
              video1_2.id,
            );
            const video2_2After = await table.courseLessonVideo.findUnique(
              video2_2.id,
            );
            expect(video1_2After).toBeNull();
            expect(video2_2After).toBeNull();

            expect(mockNext).not.toBeCalled();
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(StatusCode.SUCCESS);
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toBeCalledWith({ data: {} });
          },
        },
        {
          name: "BadRequest: Non-existent Course",
          generateParams: async () => {
            const { course } = await randDb.generateCourse();

            return {
              courseId: course.id.toString(),
            };
          },
          test: async (testParams: TestParams) => {
            const { mockRequest, mockResponse, mockNext } = testParams;
            mockNextError(mockRequest, mockResponse, mockNext);
            const spyOnDeleteCourseService = jest.spyOn(
              CourseService.prototype,
              "deleteCourse",
            );
            const courseId = Number(mockRequest.params.courseId);

            await table.course.delete(courseId);
            const course = await table.course.findUnique(courseId);
            expect(course).toBeNull();

            await controller.deleteCourse(mockRequest, mockResponse, mockNext);

            await expect(spyOnDeleteCourseService).toHaveBeenCalledTimes(1);
            expect(spyOnDeleteCourseService).toBeCalledWith(courseId);
            expect(spyOnDeleteCourseService).rejects.toThrowError(
              expect.any(Error),
            );

            expect(mockNext).toHaveBeenCalledTimes(1);
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
          const params = await tc.generateParams();
          (mockRequest as Request).params = params;

          await tc.test({ mockRequest, mockResponse, mockNext });
        });
      });
    });
  });

  describe("CourseLike", () => {
    describe("CreateLike", () => {
      type TestParams = {
        mockRequest: Request;
        mockResponse: Response;
        mockNext: NextFunction;
      };
      type TestCase = {
        name: string;
        modifyDto: (dto: CreateCourseLikeDto) => Partial<CreateCourseLikeDto>;
        test: (testParams: TestParams) => Promise<void>;
      };

      const testCases: TestCase[] = [
        {
          name: "OK: Complete Body",
          modifyDto: (
            dto: CreateCourseLikeDto,
          ): Partial<CreateCourseLikeDto> => {
            return {
              ...dto,
            };
          },
          test: async (testParams: TestParams) => {
            const { mockRequest, mockResponse, mockNext } = testParams;
            const user = await randDb.generateUser(Role.STUDENT);
            const {
              course: { id: courseId },
            } = await randDb.generateCourse();

            (mockRequest as any).user = user;
            (mockRequest as any).resourceId = {
              courseId,
            } satisfies CourseLikeResourceId;

            const spyOnCreateCourseLikeService = jest.spyOn(
              CourseService.prototype,
              "createLike",
            );

            await controller.createLike(mockRequest, mockResponse, mockNext);

            expect(spyOnCreateCourseLikeService).toHaveBeenCalledTimes(1);
            expect(spyOnCreateCourseLikeService).toHaveBeenCalledWith(
              user.id,
              (mockRequest as any).resourceId,
            );
            const newCourseLikeFromService =
              await spyOnCreateCourseLikeService.mock.results[0].value;

            const courseAfter = await table.course.findUnique(courseId);
            expect(courseAfter?.totalLikes).toEqual(1);

            expect(mockNext).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.RESOURCE_CREATED,
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
              data: newCourseLikeFromService,
            });
          },
        },
        {
          name: "BadRequest: CourseLike Already Exist",
          modifyDto: (
            dto: CreateCourseLikeDto,
          ): Partial<CreateCourseLikeDto> => {
            return {
              ...dto,
            };
          },
          test: async (testParams: TestParams) => {
            const { mockRequest, mockResponse, mockNext } = testParams;
            mockNextError(mockRequest, mockResponse, mockNext);
            const user = await randDb.generateUser(Role.STUDENT);
            const {
              course: { id: courseId },
            } = await randDb.generateCourse();
            await randDb.insertOneLikeIntoCourse(user.id, courseId);

            const courseBefore = await table.course.findUniqueOrThrow(courseId);
            expect(courseBefore.totalLikes).toEqual(1);

            (mockRequest as any).user = user;
            (mockRequest as any).resourceId = {
              courseId,
            } satisfies CourseLikeResourceId;

            const spyOnCreateCourseLikeService = jest.spyOn(
              CourseService.prototype,
              "createLike",
            );

            await controller.createLike(mockRequest, mockResponse, mockNext);

            expect(spyOnCreateCourseLikeService).toHaveBeenCalledTimes(1);
            expect(spyOnCreateCourseLikeService).toHaveBeenCalledWith(
              user.id,
              (mockRequest as any).resourceId,
            );

            const courseAfter = await table.course.findUnique(courseId);
            expect(courseAfter?.totalLikes).toEqual(1);

            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.BAD_REQUEST,
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
          await tc.test({ mockRequest, mockResponse, mockNext });
        });
      });
    });

    describe("DeleteLike", () => {
      type TestParams = {
        mockRequest: Request;
        mockResponse: Response;
        mockNext: NextFunction;
      };
      type TestCase = {
        name: string;
        test: (testParams: TestParams) => Promise<void>;
      };

      const testCases: TestCase[] = [
        {
          name: "OK",
          test: async (testParams: TestParams) => {
            const { mockRequest, mockResponse, mockNext } = testParams;
            const user = await randDb.generateUser(Role.STUDENT);
            const {
              course: { id: courseId },
            } = await randDb.generateCourse();
            const { id: likeId } = await randDb.insertOneLikeIntoCourse(
              user.id,
              courseId,
            );

            const courseBefore = await table.course.findUniqueOrThrow(courseId);
            expect(courseBefore.totalLikes).toEqual(1);

            (mockRequest as any).resourceId = {
              courseId,
              likeId,
            } satisfies CourseLikeResourceId;

            const spyOnDeleteCourseLikeService = jest.spyOn(
              CourseService.prototype,
              "deleteLike",
            );

            await controller.deleteLike(mockRequest, mockResponse, mockNext);

            expect(spyOnDeleteCourseLikeService).toHaveBeenCalledTimes(1);
            expect(spyOnDeleteCourseLikeService).toHaveBeenCalledWith(
              (mockRequest as any).resourceId,
            );
            const newCourseLikeFromService =
              await spyOnDeleteCourseLikeService.mock.results[0].value;

            const likeAfter = await table.courseLike.findUnique(likeId);
            expect(likeAfter).toBeNull();

            const courseAfter = await table.course.findUnique(courseId);
            expect(courseAfter?.totalLikes).toEqual(0);

            expect(mockNext).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(
              StatusCode.SUCCESS,
            );
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({ data: {} });
          },
        },
      ];

      testCases.forEach((tc) => {
        return it(tc.name, async () => {
          await tc.test({ mockRequest, mockResponse, mockNext });
        });
      });
    });
  });
});
