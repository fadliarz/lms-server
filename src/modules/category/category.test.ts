import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import errorMiddleware from "../../middlewares/errorMiddleware";
import { ICourseCategoryController } from "./controller/category.controller";
import { PrismaClient } from "@prisma/client";
import RandPrisma from "../../common/class/randprisma/RandPrisma";
import dIContainer from "../../inversifyConfig";
import {
  CourseCategoryDITypes,
  CourseCategoryModel,
  CreateCourseCategoryDto,
} from "./category.type";
import PrismaClientSingleton from "../../common/class/PrismaClientSingleton";
import { CourseCategoryService } from "./service/category.service";
import { StatusCode } from "../../common/constants/statusCode";
import { ErrorCode } from "../../common/constants/errorCode";

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
 *
 */
function mockNextError(
  mockRequest: Request,
  mockResponse: Response,
  mockNext: NextFunction
): void {
  (mockNext as jest.Mock).mockImplementation((error: Error) => {
    errorMiddleware(error, mockRequest, mockResponse, mockNext);
  });
}

describe("CourseCategory", () => {
  let controller: ICourseCategoryController;
  let prisma: PrismaClient;
  let randPrisma: RandPrisma;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeAll(async () => {
    controller = dIContainer.get<ICourseCategoryController>(
      CourseCategoryDITypes.CONTROLLER
    );
    prisma = PrismaClientSingleton.getInstance();
    randPrisma = new RandPrisma();
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

  describe("CreateCategory", () => {
    type TestParams = {
      mockRequest: Request;
      mockResponse: Response;
      mockNext: NextFunction;
    };
    type TestCase = {
      name: string;
      modifyDto: (
        dto: CreateCourseCategoryDto
      ) => Partial<CreateCourseCategoryDto>;
      test: (params: TestParams) => Promise<void>;
    };

    const testCases: TestCase[] = [
      {
        name: "OK: Complete Dto",
        modifyDto: (
          dto: CreateCourseCategoryDto
        ): Partial<CreateCourseCategoryDto> => {
          return {
            ...dto,
          };
        },
        test: async (params: TestParams): Promise<void> => {
          const { mockRequest, mockResponse, mockNext } = params;
          const spyOnCreateCategoryService = jest.spyOn(
            CourseCategoryService.prototype,
            "createCategory"
          );

          await controller.createCategory(mockRequest, mockResponse, mockNext);

          expect(spyOnCreateCategoryService).toHaveBeenCalledTimes(1);
          expect(spyOnCreateCategoryService).toHaveBeenCalledWith(
            mockRequest.body
          );

          const newCategory = (await spyOnCreateCategoryService.mock.results[0]
            .value) satisfies CourseCategoryModel;

          expect(mockNext).not.toHaveBeenCalled();
          expect(mockResponse.status).toHaveBeenCalledTimes(1);
          expect(mockResponse.status).toHaveBeenCalledWith(
            StatusCode.RESOURCE_CREATED
          );
          expect(mockResponse.json).toHaveBeenCalledTimes(1);
          expect(mockResponse.json).toHaveBeenCalledWith({
            data: newCategory,
          });
        },
      },
      {
        name: "BadRequest: Missing title",
        modifyDto: (
          dto: CreateCourseCategoryDto
        ): Partial<CreateCourseCategoryDto> => {
          return {
            ...dto,
            title: undefined,
          };
        },
        test: async (params: TestParams): Promise<void> => {
          const { mockRequest, mockResponse, mockNext } = params;
          mockNextError(mockRequest, mockResponse, mockNext);
          const spyOnCreateCategoryService = jest.spyOn(
            CourseCategoryService.prototype,
            "createCategory"
          );

          await controller.createCategory(mockRequest, mockResponse, mockNext);

          expect(spyOnCreateCategoryService).toHaveBeenCalledTimes(0);

          expect(mockNext).toHaveBeenCalledTimes(1);
          expect(mockResponse.status).toHaveBeenCalledTimes(1);
          expect(mockResponse.status).toHaveBeenCalledWith(
            StatusCode.BAD_REQUEST
          );
          expect(mockResponse.json).toHaveBeenCalledTimes(1);
          expect(mockResponse.json).toHaveBeenCalledWith({
            error: {
              errorCode: ErrorCode.INVALID_BODY,
              message: expect.any(String),
            },
          });
        },
      },
    ];

    testCases.forEach(async (tc) => {
      return it(tc.name, async () => {
        const dto = randPrisma.generateCreateCategoryDto();
        mockRequest.body = tc.modifyDto(dto);

        await tc.test({
          mockRequest,
          mockResponse,
          mockNext,
        });
      });
    });
  });
});
